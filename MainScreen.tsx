import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import EMVPaymentScreen from './src/tabletExample/EMVPaymentScreen';

const MainScreen: React.FC = () => {
  const [showEMV, setShowEMV] = useState(false);

  if (showEMV) {
    return <EMVPaymentScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RN Bridge Demo</Text>
      <Text style={styles.subtitle}>Select a feature to begin:</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to EMV Payment Demo"
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