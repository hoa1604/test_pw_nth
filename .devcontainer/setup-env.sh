#!/bin/bash

# DevContainer Environment Setup Script
# This script runs after the container is created

set -e  # Exit on any error

echo "Setting up Playwright TypeScript environment..."

# Note: Using Playwright Docker image - system packages are pre-installed
echo "📦 Using pre-configured Playwright environment..."

# Install Node.js dependencies
echo "Installing npm dependencies..."
npm install

# Install Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install

# Install system dependencies for Playwright (if needed)
echo "Checking system dependencies..."
# Note: System dependencies are pre-installed in Playwright Docker image
# npx playwright install-deps

# Verify installation
echo "Verifying installation..."
node --version
npm --version
npx playwright --version

# Create necessary directories
echo "Creating output directories..."
mkdir -p test-results
mkdir -p playwright-report

# Set permissions
echo "Setting permissions..."
chmod 755 test-results playwright-report

# Optional: Run a quick smoke test to verify setup
echo "Running setup verification..."
if [ -f "package.json" ]; then
    echo "package.json found"
    if npm run test:smoke --dry-run > /dev/null 2>&1; then
        echo "Smoke test script available"
    else
        echo "Warning: Smoke test script not found"
    fi
else
    echo "Warning: package.json not found in current directory"
fi

echo ""
echo "DevContainer setup complete!"
echo "Available commands:"
echo "  npm run test:ui     - Open Playwright UI Mode"
echo "  npm run test:smoke  - Run smoke tests" 
echo "  npm run test        - Run all tests"
echo "  npm run report      - Open HTML report"
echo ""