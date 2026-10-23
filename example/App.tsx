import { Asset } from "expo-asset";
import { File } from "expo-file-system";
import { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ExpoWallet, {
  AddToWalletButton,
  type WalletPass,
} from "@giulio987/expo-wallet";
import { GOOGLE_WALLET_JWT } from "./samples";

const isIOS = Platform.OS === "ios";

async function loadPkpassBase64(): Promise<string> {
  const asset = await Asset.fromModule(require("./pass/Event.pkpass")).downloadAsync();
  return new File(asset.localUri ?? asset.uri).base64();
}

export default function App() {
  const [passes, setPasses] = useState<WalletPass[]>([]);

  const run = (fn: () => Promise<unknown>) => async () => {
    try {
      const res = await fn();
      Alert.alert("Result", JSON.stringify(res));
    } catch (error) {
      Alert.alert("Error", String(error));
    }
  };

  const payload = async () => (isIOS ? loadPkpassBase64() : GOOGLE_WALLET_JWT);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Button title="isAvailable" onPress={run(() => ExpoWallet.isAvailable())} />
        <Button
          title="addPass"
          onPress={run(async () => ExpoWallet.addPass(await payload()))}
        />
        <Button
          title="addPasses (iOS)"
          onPress={run(async () => ExpoWallet.addPasses([await loadPkpassBase64()]))}
        />
        <Button
          title="getPasses (iOS)"
          onPress={run(async () => {
            const res = await ExpoWallet.getPasses();
            setPasses(res);
            return res.length;
          })}
        />
        {passes.map((p) => (
          <View key={`${p.passTypeIdentifier}/${p.serialNumber}`} style={styles.pass}>
            <Text style={styles.passTitle}>{p.localizedName}</Text>
            <Text>{p.organizationName}</Text>
            <Button
              title="Remove"
              onPress={run(async () => {
                const ok = await ExpoWallet.removePass(p.passTypeIdentifier, p.serialNumber);
                setPasses(await ExpoWallet.getPasses());
                return ok;
              })}
            />
          </View>
        ))}
        <Button
          title="containsPass (first)"
          onPress={run(async () => {
            const first = passes[0];
            if (!first) return "no pass loaded";
            return ExpoWallet.containsPass(first.passTypeIdentifier, first.serialNumber);
          })}
        />
        <AddToWalletButton
          style={styles.walletButton}
          buttonStyle="black"
          onPress={run(async () => ExpoWallet.addPass(await payload()))}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: (StatusBar.currentHeight ?? 56) + 24, gap: 12, alignItems: "stretch" },
  pass: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8 },
  passTitle: { fontWeight: "600" },
  walletButton: { height: 48, marginTop: 12 },
});
