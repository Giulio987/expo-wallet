import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoWalletViewProps } from './ExpoWallet.types';

const NativeView: React.ComponentType<ExpoWalletViewProps> =
  requireNativeView('ExpoWallet');

export default function ExpoWalletView(props: ExpoWalletViewProps) {
  return <NativeView {...props} />;
}
