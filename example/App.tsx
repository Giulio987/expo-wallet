import { StyleSheet, Text, View } from 'react-native';

import * as ExpoWallet from 'expo-wallet';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoWallet.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
