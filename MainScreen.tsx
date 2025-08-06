import { EMVPaymentScreenExample } from 'quivio-transaction-processor';
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const emvConfig = {
  merchantID: "SONNYTAMA35000GP",
  onlineMerchantID: "SONNYTAMA35000EP",
  isSandBox: true, // true for testing, false for production
  secureDeviceName: "EMV_VP3350_DATACAP", // Terminal device name
  operatorID: "001", // Employee ID
  posPackageID: "com.quivio.app:1.0.0"
}

const MainScreen: React.FC = () => {
  const [showEMV, setShowEMV] = useState(false);

  if (showEMV) {
    return <EMVPaymentScreenExample config={emvConfig} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Quivio Payment Processor</Text>
      <Text style={styles.subtitle}>Tap on the button below to begin</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Demo"
          onPress={() => setShowEMV(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});

export default MainScreen; 