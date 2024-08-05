/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node", 
  rootDir: 'test',
  testTimeout: 100000,
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};