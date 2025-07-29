
import React from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useEMVPayment } from './useEMVPayment';

const TickIcon = () => (
  <Text style={{ color: 'green', fontSize: 18, marginRight: 6 }}>✔️</Text>
);
const CrossIcon = () => (
  <Text style={{ color: 'red', fontSize: 18, marginRight: 6 }}>❌</Text>
);

const EMVPaymentScreen: React.FC = () => {
  const {
    logs,
    isDeviceConnected,
    loading,
    handleCardPayment,
    handleInHousePayment,
    setupConfig,
  } = useEMVPayment();

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        {isDeviceConnected ? <TickIcon /> : <CrossIcon />}
        <Text style={[styles.statusLabel, { color: isDeviceConnected ? 'green' : 'red' }]}>
          {isDeviceConnected ? 'Connected' : 'Not Connected'}
        </Text>
      </View>

      <Text style={styles.title}>EMV Payment Demo</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.ctaButton, !isDeviceConnected ? styles.ctaButtonEnabled : styles.ctaButtonDisabled]}
          onPress={setupConfig}
          disabled={isDeviceConnected || loading}
        >
          <Text style={styles.ctaButtonText}>Setup Configuration</Text>
        </TouchableOpacity>

        <Button title="Start EMV Sale" onPress={() => handleCardPayment('1.50')} disabled={loading} />
        <Button title="Prepaid Stripe Card" onPress={handleInHousePayment} disabled={loading} />
      </View>

      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <Text style={styles.logTitle}>Event Log</Text>
      <ScrollView style={styles.logArea} contentContainerStyle={styles.logContent}>
        {logs.length === 0 ? (
          <Text style={styles.logEmpty}>No events yet.</Text>
        ) : (
          logs.map((log, idx) => (
            <View key={log.timestamp + idx} style={styles.logItem}>
              <Text style={styles.logType}>{log.type}</Text>
              <Text style={styles.logPayload}>
                {typeof log.payload === 'object'
                  ? JSON.stringify(log.payload, null, 2)
                  : String(log.payload)}
              </Text>
              <Text style={styles.logTime}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    alignItems: 'center',
  },
  ctaButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  ctaButtonEnabled: {
    backgroundColor: '#007AFF',
  },
  ctaButtonDisabled: {
    backgroundColor: '#CCC',
  },
  ctaButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  logArea: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    padding: 8,
  },
  logContent: {
    paddingBottom: 16,
  },
  logEmpty: {
    color: '#AAA',
    textAlign: 'center',
    marginTop: 24,
  },
  logItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logType: {
    fontWeight: 'bold',
    color: '#333',
  },
  logPayload: {
    color: '#444',
    marginTop: 2,
    fontSize: 13,
  },
  logTime: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'right',
  },
});

export default EMVPaymentScreen;
