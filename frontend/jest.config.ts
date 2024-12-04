export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^shared/(.*)$': '<rootDir>/src/shared/$1',
    '^features/(.*)$': '<rootDir>/src/features/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
  },
  roots: ["./tests"],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
