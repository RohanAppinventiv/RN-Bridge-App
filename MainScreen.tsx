import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import EMVPaymentScreen from './src/example/EMVPaymentScreen';
import { emvConfig } from './src/utils/config';

const MainScreen: React.FC = () => {
  const [showEMV, setShowEMV] = useState(false);

  if (showEMV) {
    return <EMVPaymentScreen config={emvConfig} />;
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