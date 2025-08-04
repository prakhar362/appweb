import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { sendTransaction } from '../utils/phantom';

interface Props {
  publicKey: string;
}

export default function ExploreScreen({ publicKey }: Props) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = async () => {
    try {
      const signature = await sendTransaction(publicKey, recipient, parseFloat(amount));
      Alert.alert('Success', Transaction sent!\nSignature:\n${signature});
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recipient Address"
        value={recipient}
        onChangeText={setRecipient}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Amount (SOL)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="Send SOL" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    width: '100%',
  },
});