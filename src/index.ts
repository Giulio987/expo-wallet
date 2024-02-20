import ExpoWalletModule from "./ExpoWalletModule";

/**
 * @description Check if the wallet is available on the device
 * @returns {Promise<boolean>} true if the wallet is available, false if not
 * NOTE: This is only available on ANDROID
 */
export async function isAvailable(): Promise<boolean> {
  return await ExpoWalletModule.isAvailable();
}

/**
 * @description Add a pass to the wallet
 * @param passData a base64 encoded string of the pass data for iOS or a token for Android (Google's API)
 * @returns {Promise<boolean | Error>} true if the pass was added, false if the user cancelled, or an error
 */
export async function addPass(
  passData: string | any
): Promise<boolean | Error> {
  return await ExpoWalletModule.addPass(passData);
}

export enum WALLET_ERRORS {
  E_PASS_LIBRARY_CANNOT_ADD,
  E_PASS_LIBRARY_INVALID_DATA,
  E_PASS_LIBRARY_GENERIC,
  E_PASS_LIBRARY_UNAVAILABLE,
}
