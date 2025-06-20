import * as React from 'react';

import { ExpoWalletViewProps } from './ExpoWallet.types';

export default function ExpoWalletView(props: ExpoWalletViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
