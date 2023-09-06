import * as React from 'react';

import { ExpoWalletViewProps } from './ExpoWallet.types';

export default function ExpoWalletView(props: ExpoWalletViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
