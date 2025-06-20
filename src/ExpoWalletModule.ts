import { NativeModule, requireNativeModule } from "expo";
import { ExpoWalletModuleEvents } from "./ExpoWallet.types";

declare class ExpoWalletModule extends NativeModule<ExpoWalletModuleEvents> {
  isAvailable(): Promise<boolean>;
  addPass(passData: string | any): Promise<boolean | Error>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWalletModule>("ExpoWallet");
