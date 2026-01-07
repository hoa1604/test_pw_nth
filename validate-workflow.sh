#!/bin/bash

# Validate GitHub Actions workflow locally
# This script simulates the workflow steps without running act

echo "🔍 Validating GitHub Actions workflow..."

# Check if all required files exist
echo "📁 Checking required files..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found"
    exit 1
fi

if [ -f "playwright.config.ts" ]; then
    echo "✅ playwright.config.ts found" 
else
    echo "❌ playwright.config.ts not found"
    exit 1
fi

if [ -f ".github/workflows/run-tests.yml" ]; then
    echo "✅ GitHub workflow found"
else
    echo "❌ GitHub workflow not found"
    exit 1
fi

# Validate Node.js version
echo "📦 Checking Node.js version..."
node_version=$(node --version)
echo "Node.js version: $node_version"

# Check npm cache
echo "🗂️ Checking npm..."
npm --version

# Test npm ci (dry run)
echo "📋 Testing dependency installation (dry run)..."
npm ci --dry-run

# Check if Playwright is accessible
echo "🎭 Checking Playwright..."
if command -v npx playwright &> /dev/null; then
    npx playwright --version
    echo "✅ Playwright is accessible"
else
    echo "❌ Playwright not found"
fi

# Validate test structure
echo "🧪 Checking test structure..."
if [ -d "tests" ]; then
    echo "✅ Tests directory found"
    echo "📊 Test files count: $(find tests -name "*.spec.ts" -o -name "*.test.ts" | wc -l)"
else
    echo "❌ Tests directory not found"
fi

# Test environment variables simulation
echo "🌍 Testing environment setup..."
export BASE_URL="https://demoblaze.com/"
echo "BASE_URL set to: $BASE_URL"

# Simulate the actual command that would run
echo "⚡ Simulating test commands..."
echo "Command: npx playwright test --workers=2 --project=chromium tests/ui/"
echo "Command: npx playwright test --workers=2 tests/regression/"

# Check if Docker is available (needed for act)
echo "🐳 Checking Docker availability..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is available"
    docker --version
else
    echo "⚠️ Docker not found - act won't work without Docker"
fi

echo "✨ Local validation completed!"
echo ""
echo "💡 Next steps:"
echo "1. Install Docker Desktop if not available"
echo "2. Restart terminal and try: act workflow_dispatch"
echo "3. Or run manual tests: npx playwright test @smoke"