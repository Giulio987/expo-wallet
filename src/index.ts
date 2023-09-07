import ExpoWalletModule from './ExpoWalletModule';

export async function addPassFromBase64(
  passData: string
): Promise<boolean | Error> {
  return await ExpoWalletModule.addPassFromBase64(passData);
}

export async function addPassFromToken(
  passData: string
): Promise<boolean | Error> {
  return await ExpoWalletModule.addPassFromToken(passData);
}

export async function isAvailable(): Promise<boolean> {
  return await ExpoWalletModule.isAvailable();
}
