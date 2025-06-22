# Makefile for FastAPI Python project using Pipenv

# Variables
PIPENV := $(shell command -v pipenv 2> /dev/null)
PYTHON := $(shell command -v python3 2> /dev/null)
PIP := $(shell command -v pip3 2> /dev/null)
PIPENV_VERBOSITY ?= -1
PROJECT_DIR := $(shell dirname $(abspath $(lastword $(MAKEFILE_LIST))))
BIN_DIR := $(PROJECT_DIR)/.bin

export PIPENV_VERBOSITY

# Helpers
default: help

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo "Available targets:"
	@echo "  install        Install all dependencies using Pipenv"
	@echo "  run            Run FastAPI app with uvicorn"
	@echo "  shell          Open a Pipenv shell"
	@echo "  lint           Run flake8 linter"
	@echo "  format         Run black code formatter"
	@echo "  test           Run tests with pytest"
	@echo "  clean          Remove Python cache and build artifacts"
	@echo "  requirements   Export requirements.txt from Pipenv"
	@echo "  dc             Run docker-compose services, Usage: make dc SERVICES=db,redis"
	@echo "  build          Build Docker image"

.PHONY: ensure-pipenv
ensure-pipenv:
	@if [ -z "$(PIPENV)" ]; then \
	  if [ -n "$(BREW)" ]; then \
	    echo "[INFO] Pipenv not found. Installing with Homebrew..."; \
	    brew install pipenv; \
	  elif [ -n "$(PYTHON)" ] && [ -n "$(PIP)" ]; then \
	    echo "[INFO] Pipenv not found. Installing with pip..."; \
	    $(PIP) install --user pipenv; \
	  else \
	    echo "[ERROR] Pipenv not found and Homebrew is not available."; \
	    exit 1; \
	  fi; \
	fi

# Dependency management
.PHONY: install
install: ensure-pipenv
	$(PIPENV) install --dev

.PHONY: shell
shell: ensure-pipenv
	$(PIPENV) shell

.PHONY: requirements
requirements: ensure-pipenv
	$(PIPENV) lock --requirements > requirements.txt

# Running FastAPI
.PHONY: run
run: ensure-pipenv
	$(PIPENV) run uvicorn app.main:app --reload

# Linting and formatting
.PHONY: check
check: lint format
	@echo "Linting and formatting checks completed."

.PHONY: lint
lint: ensure-pipenv
	$(PIPENV) run flake8 .

.PHONY: format
format: ensure-pipenv
	$(PIPENV) run black .

# Testing
.PHONY: test
test: ensure-pipenv
	$(PIPENV) run pytest

# Docker Compose Services
.PHONY: dc
# Usage: make dc SERVICES=db,redis
SERVICES ?=
dc:
	@if [ -z "$(SERVICES)" ]; then \
		docker-compose up -d --build; \
	else \
		IFS=',' read -ra svc <<< "$(SERVICES)"; \
		echo "Running services: $${svc[@]}"; \
		docker-compose up -d --build $${svc[@]}; \
	fi
