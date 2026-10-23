import type { HybridObject } from 'react-native-nitro-modules'

export interface WalletPass {
  passTypeIdentifier: string
  serialNumber: string
  organizationName: string
  localizedName: string
  localizedDescription: string
  /** Unix timestamp in milliseconds */
  relevantDate?: number
  passURL?: string
  isRemotePass: boolean
}

export interface Wallet
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /** iOS: PassKit library available. Android: Google Wallet API available. */
  isAvailable(): Promise<boolean>
  /** iOS only. Android always returns `false`; use `isAvailable()`. */
  canAddPasses(): boolean
  /**
   * iOS: base64 encoded `.pkpass`. Android: signed Google Wallet JWT.
   * Resolves `true` if added, `false` if the user cancelled.
   */
  addPass(data: string): Promise<boolean>
  /** iOS only: base64 encoded `.pkpass` files. */
  addPasses(data: string[]): Promise<boolean>
  /** iOS only: passes of your pass type identifiers (entitlement). */
  getPasses(): Promise<WalletPass[]>
  /** iOS only. */
  containsPass(
    passTypeIdentifier: string,
    serialNumber: string
  ): Promise<boolean>
  /** iOS only. */
  removePass(passTypeIdentifier: string, serialNumber: string): Promise<boolean>
}
