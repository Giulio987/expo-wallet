import { Platform } from 'react-native';
import ExpoWalletModule from './ExpoWalletModule';

async function addPassFromBase64(passData: string): Promise<boolean | Error> {
  return await ExpoWalletModule.addPassFromBase64(passData);
}

async function addPassFromToken(passData: string): Promise<boolean | Error> {
  return await ExpoWalletModule.addPassFromToken(passData);
}

/**
 * @description Check if the wallet is available on the device
 * @returns {Promise<boolean>} true if the wallet is available, false if not
 * NOTE: This is only available on ANDROID
 */
export async function isAvailable(): Promise<boolean> {
  if (Platform.OS === 'ios') return true;
  return await ExpoWalletModule.isAvailable();
}

/**
 * @description Add a pass to the wallet
 * @param passData a base64 encoded string of the pass data for iOS or a token for Android (Google's API)
 * @returns {Promise<boolean | Error>} true if the pass was added, false if the user cancelled, or an error
 */
export async function addPass(passData: string): Promise<boolean | Error> {
  if (Platform.OS === 'ios') {
    return await addPassFromBase64(passData);
  } else if (Platform.OS === 'android') {
    return await addPassFromToken(passData);
  } else {
    return false;
  }
}
