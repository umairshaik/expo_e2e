const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json', 'svg', 'mjs');
config.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg');

module.exports = config;
