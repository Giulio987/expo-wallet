import ExpoWalletModule from './ExpoWalletModule';

export async function addPassFromBase64(
  passData: string
): Promise<boolean | Error> {
  return await ExpoWalletModule.addPassFromBase64(passData);
}
