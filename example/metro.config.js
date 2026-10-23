const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const root = path.resolve(__dirname, '..')
const config = getDefaultConfig(__dirname)

// The library lives one level up: watch it, but resolve react/react-native/nitro only from the example.
config.resolver.assetExts.push('pkpass')
config.watchFolders = [root]
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')]
config.resolver.extraNodeModules = {
  '@giulio987/expo-wallet': root,
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  'react-native-nitro-modules': path.resolve(__dirname, 'node_modules/react-native-nitro-modules'),
}
config.resolver.blockList = [
  ...Array.from(config.resolver.blockList ?? []),
  new RegExp(`${root}/node_modules/(react|react-native|react-native-nitro-modules)/.*`),
]

module.exports = config
