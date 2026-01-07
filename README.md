# Playwright TypeScript Automation Framework

A comprehensive end-to-end testing framework built with Playwright and TypeScript, featuring advanced test architecture, cross-browser support, and robust reporting capabilities.

## 🏗️ Framework Structure and Rationale

### Architecture Overview

This framework follows a **Page Object Model (POM)** pattern with advanced fixture management, providing maintainable, scalable, and reusable automation code.

```
📦 Playwright_Typescript/
├── 🔧 src/                          # Core framework components
│   ├── config/                      # Configuration management
│   │   ├── config.ts               # Main configuration settings
│   │   └── data.ts                 # Test data management
│   ├── fixtures/                   # Test fixtures and setup
│   │   └── test.fixture.ts         # Custom test fixtures
│   ├── pages/                      # Page Object Model classes
│   │   ├── BasePage.ts            # Base page with common functionality
│   │   ├── HomePage.ts            # Home page interactions
│   │   ├── LoginPage.ts           # Login page functionality
│   │   ├── ProductPage.ts         # Product-related actions
│   │   ├── CartPage.ts            # Shopping cart operations
│   │   └── index.ts               # Page exports
│   ├── types/                      # TypeScript type definitions
│   └── utils/                      # Utility functions and helpers
├── 🧪 tests/                        # Test suite organization
│   ├── api/                        # API testing suite
│   ├── ui/                         # UI testing suite
│   │   └── login.spec.ts          # Login functionality tests
│   └── regression/                 # Regression testing suite
│       └── e2e-integration-demo.spec.ts  # End-to-end demo scenarios
├── 📊 test-results/                 # Test execution results
├── 📈 playwright-report/            # HTML test reports
├── 🎯 allure-results/              # Allure reporting data
├── ⚙️ .github/workflows/           # CI/CD pipeline configuration
├── 🔧 playwright.config.ts         # Playwright configuration
├── 📋 package.json                 # Dependencies and scripts
└── 📘 README.md                    # This documentation
```

### Key Design Principles

#### 1. **Page Object Model (POM)**
- **Encapsulation**: Each page has its own class with locators and methods
- **Reusability**: Page methods can be reused across multiple test scenarios
- **Maintainability**: UI changes require updates in only one place
- **Readability**: Tests focus on business logic, not implementation details

#### 2. **Custom Fixtures**
- **Setup/Teardown**: Automated browser and page initialization
- **Dependency Injection**: Automatic page object instantiation
- **State Management**: Consistent test environment preparation

#### 3. **Configuration Management**
- **Environment Variables**: Flexible configuration for different environments
- **Centralized Settings**: Single source of truth for timeouts, URLs, and browser settings
- **Multi-Environment Support**: Easy switching between staging, production, etc.

#### 4. **Comprehensive Reporting**
- **HTML Reports**: Rich visual test reports with screenshots and videos
- **JSON/JUnit**: Machine-readable reports for CI/CD integration
- **Allure Integration**: Advanced reporting with detailed analytics

#### 5. **Test Organization**
- **Tagged Tests**: `@smoke`, `@regression`, `@ui`, `@api` for selective execution
- **Modular Structure**: Separate directories for different test types
- **Parallel Execution**: Optimized for faster test execution

## 🚀 Demo Script Execution Guide

### Prerequisites

1. **Install Dependencies**
   ```powershell
   npm install
   ```

2. **Install Playwright Browsers**
   ```powershell
   npm run install:browsers
   ```

3. **Environment Setup** (Optional)
   Create a `.env` file in the root directory:
   ```env
   BASE_URL=https://demoblaze.com/
   HEADLESS=false
   WORKERS=4
   TEST_TIMEOUT=30000
   ```

### 🎯 Quick Demo Execution

#### 1. **Complete E2E Demo** (Recommended Starting Point)
This comprehensive demo showcases the full framework capabilities:

```powershell
# Run the complete end-to-end integration demo
npx playwright test tests/regression/e2e-integration-demo.spec.ts

# Run with browser visible (headed mode)
npx playwright test tests/regression/e2e-integration-demo.spec.ts --headed

# Run with debug mode for step-by-step execution
npx playwright test tests/regression/e2e-integration-demo.spec.ts --debug
```

**What this demo covers:**
- User authentication flow
- Product search and filtering
- Shopping cart interactions
- Cross-page navigation
- Data validation
- Error handling scenarios

#### 2. **Login Functionality Demo**
Focus on authentication scenarios:

```powershell
# Run login-specific tests
npx playwright test tests/ui/login.spec.ts
```



### 🎛️ Advanced Execution Options

#### **Cross-Browser Testing**
```powershell
# Test on specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Test on mobile devices
npm run test:mobile
```

#### **Parallel vs Serial Execution**
```powershell
# Maximum parallelization (4 workers)
npm run test:parallel

# Serial execution (debugging)
npm run test:serial

# Custom worker count
npx playwright test --workers=2
```

#### **Environment-Specific Testing**
```powershell
# Set environment variables for different targets
$env:BASE_URL="https://staging.demoblaze.com/"
npx playwright test

# Production environment testing
$env:BASE_URL="https://demoblaze.com/"
npx playwright test
```

#### **Interactive Modes**
```powershell
# UI Mode - Interactive test runner
npm run test:ui

# Debug Mode - Step through tests
npm run test:debug

# Headed Mode - See browser actions
npm run test:headed
```

### 📊 Viewing Test Results

#### **HTML Reports** (Auto-opens after test completion)
```powershell
# Generate and view HTML report
npm run report
```

#### **Real-time Monitoring**
```powershell
# Run tests with live reporting
npx playwright test --reporter=list
```

## 🛠️ Development and Maintenance

### **Code Quality**
```powershell
# Lint TypeScript code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### **Adding New Tests**
1. Create test files in appropriate directories (`tests/ui/`, `tests/api/`, `tests/regression/`)
2. Use the fixture system: `import { testWithSetup as test } from '../../src/fixtures/test.fixture'`
3. Add appropriate tags for test organization
4. Follow the established naming conventions

### **CI/CD Integration**
The framework includes GitHub Actions workflow for automated testing:
- Triggered on push/PR to main branch
- Configurable test execution (environment, tags, browsers)
- Automatic report generation and artifact storage

## 🎯 Demo Test Scenarios

The framework includes several demo scenarios to showcase capabilities:

1. **Login Authentication** (`tests/ui/login.spec.ts`)
   - Valid/invalid credentials
   - Session management
   - Error message validation

2. **E2E Integration** (`tests/regression/e2e-integration-demo.spec.ts`)
   - Complete user journey
   - Multi-page interactions
   - Data consistency validation

3. **Cross-browser Compatibility**
   - Chrome, Firefox, Safari testing
   - Mobile responsive testing
   - Viewport-specific scenarios

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Guidelines](https://www.typescriptlang.org/docs)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Configuration](https://playwright.dev/docs/test-configuration)

---

**Framework Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintained By**: Nguyen Thi Hoa