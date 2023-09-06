import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoWalletViewProps } from './ExpoWallet.types';

const NativeView: React.ComponentType<ExpoWalletViewProps> =
  requireNativeViewManager('ExpoWallet');

export default function ExpoWalletView(props: ExpoWalletViewProps) {
  return <NativeView {...props} />;
}
