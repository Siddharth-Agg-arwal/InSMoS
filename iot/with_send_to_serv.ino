#include <WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <time.h>
/*
ESP pin - ADS1299
3.3V - J4, 9
5V - J4, 10
GND - J4, 5
14 - J3, CLK 3
12 - J3, DOUT 13
13  -J3, DIN 11
22 - J3, RESET 8
21 - J3, 1 with JP22 2-3 short
GND - J3, 10
5 - J3, CS 7
4 - J3, DRDY 15
Refrence - J6, 36
Main - J6, 34
*/
// ========== USER CONFIGURATION ==========
// --- WiFi Credentials ---
const char* ssid = "F14";
const char* password = "12345678";

// --- MQTT Broker Details ---
const char* mqtt_server = "192.168.2.173"; // e.g., "192.168.1.100"
const int mqtt_port = 1883;
const char* mqtt_topic = "eeg/data"; // MQTT Topic to publish to

// --- Patient Details ---
const int patient_id = 1; // Set your patient ID here

// --- NTP Configuration for Timestamp ---
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 19800;   // Your GMT offset in seconds (e.g., India is +5:30 -> 5*3600 + 30*60 = 19800)
const int   daylightOffset_sec = 0;  // Daylight saving offset

// ========== ADS1299 PIN DEFINITIONS ==========
const int CS_PIN = 5;
const int DRDY_PIN = 4;
const int RESET_PIN = 22;
const int START_PIN = 21;

// ========== ADS1299 SPI COMMANDS & REGISTERS ==========
const byte WAKEUP  = 0x02, STANDBY = 0x04, RESET   = 0x06;
const byte START   = 0x08, STOP    = 0x0A, RDATAC  = 0x10;
const byte SDATAC  = 0x11, RDATA   = 0x12, WREG    = 0x40;
const byte RREG    = 0x20;
const byte ID_REG  = 0x00, CONFIG1_REG = 0x01, CONFIG3_REG = 0x03;
const byte CH1SET_REG = 0x05, MISC1_REG = 0x15;

// ========== GLOBAL VARIABLES ==========
// --- Networking ---
WiFiClient espClient;
PubSubClient client(espClient);
char json_payload[512]; // Buffer to hold the JSON payload
const bool debug_no_wifi = false; // Set to 'true' to run without WiFi and MQTT.

// --- ADS1299 & Data ---
volatile boolean dataReady = false;
byte dataBuffer[27];
SPISettings ads_spi_settings(1000000, MSBFIRST, SPI_MODE1);
const float V_REF = 4.5;
const float GAIN = 24.0;
const float ADC_SCALE_FACTOR = V_REF / (GAIN * (pow(2, 23)));
float channel_filtered[8] = {0, 0, 0, 0, 0, 0, 0, 0};
const float filter_alpha = 0.97;

// ========== INTERRUPT SERVICE ROUTINE (ISR) ==========
void ICACHE_RAM_ATTR ISR_DRDY() {
  dataReady = true;
}

// ========== SETUP FUNCTION ==========
void setup() {
  Serial.begin(115200);
  Serial.println("\n--- ADS1299 EEG MQTT Publisher ---");

  if (!debug_no_wifi) {
    // --- 1. Connect to WiFi and Sync Time ---
    setup_wifi();
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    // --- 2. Configure MQTT Client ---
    client.setServer(mqtt_server, mqtt_port);
  }

  // --- 3. Initialize ADS1299 Hardware (Your existing logic) ---
  pinMode(CS_PIN, OUTPUT);
  pinMode(RESET_PIN, OUTPUT);
  pinMode(START_PIN, OUTPUT);
  pinMode(DRDY_PIN, INPUT_PULLUP);
  digitalWrite(START_PIN, LOW);
  SPI.begin(14, 12, 13, 5);
  initializeADS();
  attachInterrupt(digitalPinToInterrupt(DRDY_PIN), ISR_DRDY, FALLING);

  Serial.println("Initialization successful. Waiting for data to send via MQTT...");
}

// ========== MAIN LOOP ==========
void loop() {
  // Maintain MQTT connection
 if (!debug_no_wifi && !client.connected()) {
    reconnect();
  }
  if (!debug_no_wifi) {
    client.loop();
  }

// delay(500);
  // When the ADS1299 has new data available (triggered by ISR)
  if (dataReady) {
    dataReady = false; // Reset the flag
    readData();        // Read the raw byte data from the chip

    float normalized_values[8]; // Array to hold the final processed values

    // Process all 8 channels
    for (int i = 0; i < 8; i++) {
      int channelIndex = 3 + (i * 3);
      long rawValue = 0;

      // Twos complement conversion
      if (dataBuffer[channelIndex] & 0x80) {
        rawValue = 0xFF000000;
      }
      rawValue |= ((long)dataBuffer[channelIndex] << 16);
      rawValue |= ((long)dataBuffer[channelIndex + 1] << 8);
      rawValue |= dataBuffer[channelIndex + 2];

      float voltage_uV = rawValue * ADC_SCALE_FACTOR * 1000000.0;
      float voltage_mV = voltage_uV / 1000.0;

      // Filter DC offset
      channel_filtered[i] = filter_alpha * channel_filtered[i] + (1 - filter_alpha) * voltage_uV;
      normalized_values[i] = voltage_uV - channel_filtered[i];

      Serial.printf("CH%d: Raw = %ld, Voltage = %.4f uV, Filtered = %.4f uV\n",
                    i + 1, rawValue, voltage_uV, normalized_values[i]);
    }

    // --- 4. Get Timestamp and Format JSON Payload ---
    if (!debug_no_wifi) {
      char timestamp[30];
      getTimestamp(timestamp);
      snprintf(json_payload, sizeof(json_payload),
               "{\"patient_id\": %d, \"timestamp\": \"%s\", \"channel_data\": [%.4f, %.4f, %.4f, %.4f, %.4f, %.4f, %.4f, %.4f]}",
               patient_id,
               timestamp,
               normalized_values[0], normalized_values[1], normalized_values[2], normalized_values[3],
               normalized_values[4], normalized_values[5], normalized_values[6], normalized_values[7]);

      client.publish(mqtt_topic, json_payload);
      Serial.print("Published to MQTT: ");
      Serial.println(json_payload);
    } else {
      Serial.println("Debugging: Skipping MQTT publish due to debug_no_wifi flag.");
      Serial.println("--- ADS1299 Data ---");
      for (int i = 0; i < 8; i++) {
        Serial.printf("%.4f,", normalized_values[i]);
      }
      Serial.println();
    }

  }
}

// ========== HELPER FUNCTIONS ==========

// --- Networking Functions ---
void setup_wifi() {
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32-EEG-Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void getTimestamp(char* buffer) {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    strcpy(buffer, "1970-01-01T00:00:00Z"); // Fallback timestamp
    return;
  }
  // Format to ISO 8601: "YYYY-MM-DDTHH:MM:SSZ"
  strftime(buffer, 30, "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
}

// --- ADS1299 Functions (Your existing code, unchanged) ---
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

  sendCommand(SDATAC); // Stop continuous data conversion
  delay(10);

  byte deviceID = readRegister(ID_REG);
  Serial.print("Device ID read: 0x");
  Serial.println(deviceID, HEX);
  if ((deviceID & 0x1F) != 0x1E) {
    Serial.println("ERROR: Device ID check failed. Halting.");
    while (1);
  }

  // --- Recommended Changes ---
  // Use default value 0x96 for 250SPS
  writeRegister(CONFIG1_REG, 0x96);

  // Use 0xE0 to enable the internal reference buffer.
  writeRegister(CONFIG3_REG, 0xE0);

  // Set all channels to be active with GAIN=8 and Normal Input
  for (int i = 0; i < 8; i++) {
    writeRegister(CH1SET_REG + i, 0x61);
  }
  // -------------------------

  writeRegister(MISC1_REG, 0x00);
  delay(10);
  digitalWrite(START_PIN, HIGH); // Start conversions
  delay(10);
  sendCommand(RDATAC); // Resume continuous data conversion
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
