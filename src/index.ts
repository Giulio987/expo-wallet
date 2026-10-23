import { NitroModules } from 'react-native-nitro-modules'
import type { Wallet } from './specs/Wallet.nitro'

export type { WalletPass } from './specs/Wallet.nitro'
export { AddToWalletButton } from './AddToWalletButton'
export type { AddToWalletButtonProps } from './AddToWalletButton'

export const WALLET_ERRORS = {
  E_PASS_LIBRARY_CANNOT_ADD: 'E_PASS_LIBRARY_CANNOT_ADD',
  E_PASS_LIBRARY_INVALID_DATA: 'E_PASS_LIBRARY_INVALID_DATA',
  E_PASS_LIBRARY_GENERIC: 'E_PASS_LIBRARY_GENERIC',
  E_PASS_LIBRARY_UNAVAILABLE: 'E_PASS_LIBRARY_UNAVAILABLE',
  E_PASS_LIBRARY_NOT_FOUND: 'E_PASS_LIBRARY_NOT_FOUND',
  E_PASS_LIBRARY_BUSY: 'E_PASS_LIBRARY_BUSY',
  E_NO_ACTIVITY: 'E_NO_ACTIVITY',
  E_NO_CONTEXT: 'E_NO_CONTEXT',
  UNSUPPORTED: 'UNSUPPORTED',
} as const

export type WalletErrorCode = (typeof WALLET_ERRORS)[keyof typeof WALLET_ERRORS]

/** Error thrown by every wallet call; `code` is one of `WALLET_ERRORS` (or `undefined` if unknown). */
export class WalletError extends Error {
  code?: WalletErrorCode

  constructor(message: string, code?: WalletErrorCode) {
    super(message)
    this.name = 'WalletError'
    this.code = code
  }
}

const KNOWN_CODES = new Set<string>(Object.values(WALLET_ERRORS))

// Native errors arrive as plain `Error`s whose message is "<CODE>: <description>"
// (Android adds a "java.lang.Error: " prefix), so the code is recovered from the text.
function toWalletError(error: unknown): unknown {
  if (!(error instanceof Error)) return error
  const match = /(?:^|\s)([A-Z][A-Z_]+):\s*([\s\S]*)$/.exec(error.message)
  if (!match || !KNOWN_CODES.has(match[1]!)) return error
  return new WalletError(match[2]!, match[1] as WalletErrorCode)
}

async function call<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    throw toWalletError(error)
  }
}

const wallet = NitroModules.createHybridObject<Wallet>('Wallet')

/** Whether the native wallet (PassKit / Google Wallet) is available on this device. */
export const isAvailable = () => call(() => wallet.isAvailable())

/** iOS only: whether the device can add passes. */
export const canAddPasses = () => wallet.canAddPasses()

/**
 * Add a pass to the wallet.
 * @param passData iOS: base64 encoded `.pkpass`. Android: Google Wallet JWT.
 * @returns `true` if added (iOS: also if it was already in Wallet), `false` if the user cancelled.
 */
export const addPass = (passData: string) => call(() => wallet.addPass(passData))

/**
 * iOS only: add several base64 encoded `.pkpass` files at once.
 * Resolves `true` only if all of them are in Wallet afterwards; a partial add or a cancel resolves `false`.
 */
export const addPasses = (passesData: string[]) =>
  call(() => wallet.addPasses(passesData))

/** iOS only: passes of the pass type identifiers in your entitlements. */
export const getPasses = () => call(() => wallet.getPasses())

/** iOS only. */
export const containsPass = (passTypeIdentifier: string, serialNumber: string) =>
  call(() => wallet.containsPass(passTypeIdentifier, serialNumber))

/** iOS only. */
export const removePass = (passTypeIdentifier: string, serialNumber: string) =>
  call(() => wallet.removePass(passTypeIdentifier, serialNumber))

const ExpoWallet = {
  isAvailable,
  canAddPasses,
  addPass,
  addPasses,
  getPasses,
  containsPass,
  removePass,
}

export default ExpoWallet
