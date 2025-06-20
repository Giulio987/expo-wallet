// Reexport the native module. On web, it will be resolved to ExpoWalletModule.web.ts
// and on native platforms to ExpoWalletModule.ts
export { default } from './ExpoWalletModule';
export { default as ExpoWalletView } from './ExpoWalletView';
export * from  './ExpoWallet.types';
