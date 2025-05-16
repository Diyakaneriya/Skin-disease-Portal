module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // The root directory that Jest should scan for tests and modules
  rootDir: '.',
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // An array of regexp pattern strings that are matched against all test paths
  // Tests that match these patterns will be skipped
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ],
  
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover'
  ],
  
  // The paths to modules that run some code to configure or set up the testing environment
  setupFiles: ['./tests/setup.js'],
  
  // A map from regular expressions to module names that allow to stub out resources
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  
  // An array of regexp pattern strings that are matched against all modules before they are loaded
  modulePathIgnorePatterns: [],
  
  // A preset that is used as a base for Jest's configuration
  preset: null,
  
  // Run tests with a fake timer
  fakeTimers: {
    enableGlobally: true
  }
};
