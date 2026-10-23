# @giulio987/expo-wallet

<img align="right" hspace="10" src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-wallet-icon.png" alt="Google Wallet" width="120" height="120">
<img align="right" hspace="10" src="https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/6d/0c/ef/6d0cefd3-4758-d4b9-0227-8cfea8a116ca/Placeholder.mill/400x400Icon.ApSiOS01-75.webp" alt="Apple Wallet" width="120" height="120">

Add passes to **Apple Wallet** and **Google Wallet** from React Native / Expo, and read the passes already in Apple Wallet. Built on [Nitro Modules](https://nitro.margelo.com) (JSI, no bridge).

v1 is a rewrite: the module is no longer an Expo Module (`expo-modules-core`) but a Nitro module. It needs a development build, Expo Go is not supported.

## Installation

```bash
npx expo install @giulio987/expo-wallet react-native-nitro-modules
npx expo prebuild
```

Requires the New Architecture (default since Expo SDK 53) and Expo SDK 53+ / React Native 0.78+.

### Config plugin (iOS)

`getPasses`, `containsPass` and `removePass` only see passes whose *pass type identifier* is listed in the app's `com.apple.developer.pass-type-identifiers` entitlement. The plugin adds it for you:

```json
{
  "expo": {
    "plugins": [
      ["@giulio987/expo-wallet", { "passTypeIdentifiers": ["pass.com.example.mypass"] }]
    ]
  }
}
```

Without `passTypeIdentifiers` the plugin does nothing (the entitlement must be enabled on your App ID, so it is opt-in); existing identifiers are kept. The matching Pass Type ID must exist in your Apple Developer account and in the app's provisioning profile. Not using Expo? Add the entitlement in Xcode yourself.

## Usage

```ts
import ExpoWallet, { AddToWalletButton } from "@giulio987/expo-wallet";

if (await ExpoWallet.isAvailable()) {
  // iOS: base64 encoded .pkpass   Android: signed Google Wallet JWT
  const added = await ExpoWallet.addPass(Platform.OS === "ios" ? pkpassBase64 : jwt);
  // true = added, false = user cancelled
}

const passes = await ExpoWallet.getPasses(); // iOS only

<AddToWalletButton buttonStyle="black" onPress={() => ExpoWallet.addPass(payload)} />;
```

Named exports (`import { addPass } from ...`) are available too.

| API | iOS | Android |
| --- | --- | --- |
| `isAvailable()` | PassKit available | Google Wallet API available |
| `canAddPasses()` | yes | always `false` (use `isAvailable`) |
| `addPass(data)` | base64 `.pkpass` | Google Wallet JWT |
| `addPasses(data[])` | yes | rejects `UNSUPPORTED` |
| `getPasses()` | yes (your pass type IDs) | rejects `UNSUPPORTED` |
| `containsPass(typeId, serial)` | yes | rejects `UNSUPPORTED` |
| `removePass(typeId, serial)` | yes | rejects `UNSUPPORTED` |
| `<AddToWalletButton />` | `PKAddPassButton` | simple native button* |

Google Wallet has no client API to list or remove saved passes, only a server-side REST API, hence the `UNSUPPORTED` rejections.

\* The Android button is a plain black button. For production use, follow the [Google Wallet brand guidelines](https://developers.google.com/wallet/generic/resources/brand-guidelines) and use the official "Add to Google Wallet" asset.

Errors are `WalletError`s with a `code` from `WALLET_ERRORS`, e.g. `if (e instanceof WalletError && e.code === WALLET_ERRORS.UNSUPPORTED)`.

`addPass` resolves `true` if the pass was added (on iOS also if it was already in Wallet) and `false` if the user cancelled. `addPasses` resolves `true` only if every pass ended up in Wallet.

## Example

```bash
cd example
npm install
npx expo prebuild
npm run ios   # or: npm run android
```

## Development

```bash
npm install
npm run specs   # regenerates nitrogen/generated after editing src/specs/*.nitro.ts
npm run build
```

## Contributing

Issues and pull requests are welcome.

## License

MIT
