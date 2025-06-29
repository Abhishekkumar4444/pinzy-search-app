module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // Load environment variables from `.env` file
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
        safe: false,
        blacklist: null, // deprecated, can be removed
        whitelist: null, // deprecated, can be removed
      },
    ],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'], // tree-shaking for React Native Paper
    },
  },
};
