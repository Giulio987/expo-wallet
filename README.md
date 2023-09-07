# React Native Wallet Integration Module

This is a React Native module designed to simplify the integration of Wallet functionality for both iOS and Android using Expo. It allows you to add, and in the future, interact with all the features available on the iOS Wallet and Google Pay apps, within your React Native application.

## Installation

To get started, follow this step:
Install the module using npm or yarn:

```bash
npm install expo-wallet
```

or

```bash
yarn add expo-wallet
```

## Usage

### Adding a Card to Wallet (iOS)

To add a card to the Wallet app, use the addPassFromBase64 method:

```javascript
 const addToWallet = useCallback(async () => {
    try {
      const res = await ExpoWallet.addPassFromBase64(pass);
    } catch (error) {
    }
  }, []);
```

### Adding a Card to Wallet (Android)

To add a card to the Google Wallet app, use the addPassFromBase64 method:

```javascript
 const addToWallet = useCallback(async () => {
    try {
      const res = await ExpoWallet.addPassFromToken(token);
    } catch (error) {
    }
  }, []);
```

## Contributing

Feel free to contribute to this project! If you have any feature requests, bug reports, or other contributions, please open an issue or submit a pull request.

## License

This module is released under the GPL-3.0 License.
