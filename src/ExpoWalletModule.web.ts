import { registerWebModule, NativeModule } from 'expo';

import { ExpoWalletModuleEvents } from './ExpoWallet.types';

class ExpoWalletModule extends NativeModule<ExpoWalletModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoWalletModule, 'ExpoWalletModule');
