const config = {
    globals: {
        "ts-jest": {
            useESM: true
        }
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: ['src/**/*.ts'],
    transformIgnorePatterns: ['<rootDir>/node_modules/']
};

module.exports = config;
