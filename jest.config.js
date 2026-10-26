module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@react-native-community/netinfo$':
      '@react-native-community/netinfo/jest/netinfo-mock.js',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/asyncStorage.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation)/)',
  ],
};
