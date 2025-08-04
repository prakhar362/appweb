import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { connectPhantom } from '../utils/phantom';
import ExploreScreen from './explore';

export default function HomeScreen() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = async () => {
    const key = await connectPhantom();
    if (key) setPublicKey(key);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solana Wallet App</Text>
      {!publicKey ? (
        <Button title="Connect Phantom Wallet" onPress={handleConnect} />
      ) : (
        <ExploreScreen publicKey={publicKey} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
});