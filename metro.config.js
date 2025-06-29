const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Enhance/override specific fields
const config = {
  transformer: {
    minifierConfig: {
      mangle: {
        keep_fnames: true,
      },
      output: {
        ascii_only: true,
        quote_style: 3,
        wrap_iife: true,
      },
      sourceMap: false,
      toplevel: false,
      warnings: false,
      parse: {
        html5_comments: false,
        shebang: false,
      },
      compress: {
        drop_console: true, // Remove all console.* logs
        drop_debugger: true,
        dead_code: true,
        unused: true,

        // Optional compression (disabled for easier debugging)
        arguments: false,
        arrows: false,
        collapse_vars: false,
        conditionals: false,
        evaluate: false,
        hoist_funs: false,
        inline: false,
        keep_fargs: false,
        sequences: false,
      },
    },
    // Enable inline requires to improve app startup time
    inlineRequires: true,
  },

  // Optional: add custom extensions or platforms
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.concat(['webp', 'cjs']),
    sourceExts: defaultConfig.resolver.sourceExts.concat(['mjs', 'jsx', 'cjs']),
  },
};

module.exports = mergeConfig(defaultConfig, config);
