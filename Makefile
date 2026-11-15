# 5G Network Slicing Dashboard Makefile

.PHONY: help install dev build start test lint check

help:
	@echo "5G Network Slicing Project Commands:"
	@echo "  make install  - Install npm dependencies"
	@echo "  make dev      - Start Next.js development server"
	@echo "  make build    - Build production bundle"
	@echo "  make start    - Start production server"
	@echo "  make test     - Run Vitest unit tests"
	@echo "  make lint     - Run ESLint"
	@echo "  make check    - Run lint, tests, and build check"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

test:
	npm run test

lint:
	npm run lint

check: lint test build

