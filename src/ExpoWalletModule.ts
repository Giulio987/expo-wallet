import { NativeModule, requireNativeModule } from 'expo';

import { ExpoWalletModuleEvents } from './ExpoWallet.types';

declare class ExpoWalletModule extends NativeModule<ExpoWalletModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWalletModule>('ExpoWallet');
