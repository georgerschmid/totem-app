const { getDefaultConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 *
 * This configuration ensures that `.pck` files exported from Godot are
 * treated as binary assets rather than JavaScript modules.  It also adds
 * middleware to set the correct Content‑Type header when serving `.pck`
 * files from the development server.  Without this configuration the
 * bundler will try to parse the PCK file and throw an error【636210009572298†L245-L266】.
 */
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const { assetExts, sourceExts } = defaultConfig.resolver;
  return {
    resolver: {
      assetExts: [...assetExts, 'pck'],
      sourceExts: sourceExts.filter(ext => ext !== 'pck'),
    },
    server: {
      enhanceMiddleware: (middleware) => {
        return (req, res, next) => {
          if (/\.pck$/.test(req.url)) {
            res.setHeader('Content-Type', 'application/octet-stream');
          }
          return middleware(req, res, next);
        };
      },
    },
  };
})();