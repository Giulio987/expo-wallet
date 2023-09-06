import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoWallet.web.ts
// and on native platforms to ExpoWallet.ts
import ExpoWalletModule from './ExpoWalletModule';
import ExpoWalletView from './ExpoWalletView';
import { ChangeEventPayload, ExpoWalletViewProps } from './ExpoWallet.types';

// Get the native constant value.
export const PI = ExpoWalletModule.PI;

export function hello(): string {
  return ExpoWalletModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoWalletModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoWalletModule ?? NativeModulesProxy.ExpoWallet);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoWalletView, ExpoWalletViewProps, ChangeEventPayload };
