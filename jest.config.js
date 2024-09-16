module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transformIgnorePatterns: [
    "/node_modules/(?!axios)"
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '\\.(css|scss)$': 'identity-obj-proxy',  // Mock CSS imports
    '\\.(png|jpg|jpeg|gif|ttf|eot|svg)$': '<rootDir>/src/__mocks__/fileMock.js',  // Mock static assets
  },
};
