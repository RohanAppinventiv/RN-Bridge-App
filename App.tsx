import React from 'react';
import { View, Button, NativeModules } from 'react-native';

const { EMVPayment } = NativeModules;

export default function App() {
  const startTransaction = async () => {
    try {
      const result = await EMVPayment.startTransaction(100.0);
      console.log('Transaction result:', result);
    } catch (e) {
      console.error('Transaction error:', e);
    }
  };

  const getCardDetails = async () => {
    try {
      const result = await EMVPayment.getCardDetails();
      console.log('Card details:', result);
    } catch (e) {
      console.error('Card details error:', e);
    }
  };

  const cancelTransaction = async () => {
    try {
      const result = await EMVPayment.cancelTransaction();
      console.log('Cancel result:', result);
    } catch (e) {
      console.error('Cancel error:', e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Start Transaction" onPress={startTransaction} />
      <Button title="Get Card Details" onPress={getCardDetails} />
      <Button title="Cancel Transaction" onPress={cancelTransaction} />
    </View>
  );
}