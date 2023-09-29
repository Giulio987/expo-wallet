import { Platform } from 'react-native';
import ExpoWalletModule from './ExpoWalletModule';

export enum Encoding {
  BASE64 = 'base64',
}

/**
 * @description Check if the wallet is available on the device
 * @returns {Promise<boolean>} true if the wallet is available, false if not
 * NOTE: Android is async, iOS is sync
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
  passData: string,
  encoding: Encoding = Encoding.BASE64
): Promise<boolean | Error> {
  if (Platform.OS === 'ios') {
    return await ExpoWalletModule.addPassFromFile(passData, encoding);
  } else if (Platform.OS === 'android') {
    return await ExpoWalletModule.addPassFromToken(passData);
  } else {
    return false;
  }
}
