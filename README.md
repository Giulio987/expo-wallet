# React Native (Expo) Wallet Module

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

###### iOS: The pass must be a base64 encoded string of the .pkpass file

###### Android: the pass must be a [token](https://codelabs.developers.google.com/add-to-wallet-android#0)

### Adding a Card to Wallet

To add a card to the Wallet app, use the addPass method

```javascript
 const addToWallet = async () => {
    try {
      const res = await ExpoWallet.addPass(pass);
    } catch (error) {
    }
  };
```

### Check if the Wallet is available

To verify if the Wallet is available, use the isAvailable method

```javascript
 const isAvailable = async () => {
    const res = await ExpoWallet.isAvailable();
    if (res) {
      alert('Available');
    } else {
      alert('Not available');
    }
  };
```

### Soon available:

- Checking if a Card is in Wallet

## Contributing

Feel free to contribute to this project! If you have any feature requests, bug reports, or other contributions, please open an issue or submit a pull request.

## License

This module is released under the GPL-3.0 License.
