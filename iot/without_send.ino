/*
ESP32 to ADS1299 connections

ESP - ADS1299
3.3V - J4, 9
5V - J4, 10
GND - J4, 5
14 - J3, CLK 3
12 - J3, DOUT 13
13  -J3, DIN 11
22 - J3, RESET 8
GND - J3, 10
5 - J3, CS 7
4 - J3, DRDY 15
Refrence - J6, 36
Main - J6, 33
*/
#include <SPI.h>

// ========== PIN DEFINITIONS (with Manual START Pin) ==========
const int CS_PIN = 5;
const int DRDY_PIN = 4;
const int RESET_PIN = 22;
const int START_PIN = 21; 

// ========== ADS1299 SPI COMMANDS & REGISTERS ==========
const byte WAKEUP  = 0x02;
const byte STANDBY = 0x04;
const byte RESET   = 0x06;
const byte START   = 0x08;
const byte STOP    = 0x0A;
const byte RDATAC  = 0x10;
const byte SDATAC  = 0x11;
const byte RDATA   = 0x12;
const byte WREG    = 0x40;
const byte RREG    = 0x20;

const byte ID_REG      = 0x00;
const byte CONFIG1_REG = 0x01;
const byte CONFIG3_REG = 0x03;
const byte CH1SET_REG  = 0x05;
const byte MISC1_REG   = 0x15;

// ========== GLOBAL VARIABLES ==========
volatile boolean dataReady = false;
byte dataBuffer[27];
SPISettings ads_spi_settings(1000000, MSBFIRST, SPI_MODE1); 

const float V_REF = 4.5; 
const float GAIN = 24.0; 
const float ADC_SCALE_FACTOR = V_REF / (GAIN * (pow(2, 23) - 1));
float channel_filtered[8] = {0, 0, 0, 0, 0, 0, 0, 0};
// *** NEW: Variables for the high-pass filter ***
float channel_1_filtered = 0;
const float filter_alpha = 0.95; // Smoothing factor for the filter

// ========== INTERRUPT SERVICE ROUTINE (ISR) ==========
void ICACHE_RAM_ATTR ISR_DRDY() {
  dataReady = true;
}

// ========== SETUP FUNCTION ==========
void setup() {
  Serial.begin(115200);
  Serial.println("\n--- ADS1299 EMG Test with High-Pass Filter ---");

  pinMode(CS_PIN, OUTPUT);
  pinMode(RESET_PIN, OUTPUT);
  pinMode(START_PIN, OUTPUT);     
  pinMode(DRDY_PIN, INPUT_PULLUP);
  
  digitalWrite(START_PIN, LOW);

  SPI.begin(14, 12, 13, 5); 

  initializeADS();

  attachInterrupt(digitalPinToInterrupt(DRDY_PIN), ISR_DRDY, FALLING);

  Serial.println("Initialization successful. Reading and filtering data...");
}

// ========== MODIFIED MAIN LOOP ==========
void loop() {
  if (true) {
    dataReady = false; // Reset the flag
    readData();

    // Loop through all 8 channels
    for (int i = 0; i < 8; i++) {
      // Calculate the starting index for the current channel's data
      int channelIndex = 3 + (i * 3);
      
      // Reconstruct the 24-bit raw value
      long rawValue = 0;
      if (dataBuffer[channelIndex] & 0x80) { 
        rawValue = 0xFF000000;
      }
      rawValue |= ((long)dataBuffer[channelIndex] << 16);
      rawValue |= ((long)dataBuffer[channelIndex + 1] << 8);
      rawValue |= dataBuffer[channelIndex + 2];
      
      // Convert raw value to microvolts
      float voltage_uV = rawValue * ADC_SCALE_FACTOR * 1000000.0;

      // Apply the high-pass filter for the current channel
      channel_filtered[i] = filter_alpha * (channel_filtered[i] + voltage_uV - channel_filtered[i]);
      float normalized_value = voltage_uV - channel_filtered[i];

      // Print the normalized value for the current channel
      Serial.print("CH"); 
      Serial.print(i + 1); 
      Serial.print(": ");
      Serial.print(normalized_value, 4); 
      Serial.print(" uV\t");
    }
    // Print a new line after all 8 channels have been printed
    Serial.println();

    // The other channels are floating, so we don't need to print them.
  }
}

// ========== HELPER FUNCTIONS (No changes) ==========
void sendCommand(byte command) {
  SPI.beginTransaction(ads_spi_settings);
  digitalWrite(CS_PIN, LOW);
  SPI.transfer(command);
  digitalWrite(CS_PIN, HIGH);
  SPI.endTransaction();
}

void writeRegister(byte address, byte value) {
  SPI.beginTransaction(ads_spi_settings);
  digitalWrite(CS_PIN, LOW);
  SPI.transfer(WREG | address);
  SPI.transfer(0x00);
  SPI.transfer(value);
  digitalWrite(CS_PIN, HIGH);
  SPI.endTransaction();
}

byte readRegister(byte address) {
  SPI.beginTransaction(ads_spi_settings);
  digitalWrite(CS_PIN, LOW);
  SPI.transfer(RREG | address);
  SPI.transfer(0x00);
  byte regValue = SPI.transfer(0x00);
  digitalWrite(CS_PIN, HIGH);
  SPI.endTransaction();
  return regValue;
}

void initializeADS() {
  delay(500); 
  
  digitalWrite(RESET_PIN, HIGH);
  delay(100);
  digitalWrite(RESET_PIN, LOW);
  delayMicroseconds(10);
  digitalWrite(RESET_PIN, HIGH);
  delay(200);

  sendCommand(SDATAC); 
  delay(10);

  byte deviceID = readRegister(ID_REG);
  Serial.print("Device ID read: 0x");
  Serial.println(deviceID, HEX);

  if ((deviceID & 0x1F) != 0x1E) {
    Serial.println("ERROR: Device ID check failed. Halting.");
    while (1);
  }

  writeRegister(CONFIG1_REG, 0x96); 
  writeRegister(CONFIG3_REG, 0xEC); 
  // for (int i = 0; i < 8; i++) {
  //   writeRegister(CH1SET_REG + i, 0x60); 
  // }
    for (int i = 0; i < 8; i++) {
    if (i == 0) { // This is Channel 1 (since i starts at 0)
      // Enable CH1, Gain 24, Normal Electrode Input
      writeRegister(CH1SET_REG + i, 0x60); 
    } else { // This is for Channels 2 through 8
      // Power down the channel and set its input to short
      // 0x81 = 0b10000001 (PDn=1 for power down, MUXn=001 for input short)
      writeRegister(CH1SET_REG + i, 0x81);
    }
  }
  // This is for Differential CH1 setup
  writeRegister(MISC1_REG, 0x00); 
  delay(10);

  // Start conversions using the hardware pin
  digitalWrite(START_PIN, HIGH);
  
  delay(10);
  sendCommand(RDATAC);
}

void readData() {
  SPI.beginTransaction(ads_spi_settings);
  digitalWrite(CS_PIN, LOW);
  for (int i = 0; i < 27; i++) {
    dataBuffer[i] = SPI.transfer(0x00);
  }
  digitalWrite(CS_PIN, HIGH);
  SPI.endTransaction();
}