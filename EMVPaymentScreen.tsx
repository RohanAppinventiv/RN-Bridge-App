import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

const { DsiEMVManagerBridge } = NativeModules;

const EVENT_NAMES = [
  'onError',
  'onCardReadSuccessfully',
  'onSaleTransactionCompleted',
  'onShowMessage',
  'onConfigError',
  'onConfigPingFailed',
  'onConfigPingSuccess',
  'onConfigCompleted',
];

const EMVPaymentScreen: React.FC = () => {
  const [logs, setLogs] = useState<CallbackLog[]>([]);
  const eventEmitterRef = useRef<NativeEventEmitter | null>(null);
  const listenersRef = useRef<{ [event: string]: any }>({});

  const appendLog = useCallback((type: string, payload: any) => {
    setLogs((prev) => [
      {
        type,
        payload,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  useEffect(() => {
    if (!DsiEMVManagerBridge) {
      Alert.alert('Native module DsiEMVManagerBridge not found');
      return;
    }
    const emitter =
      eventEmitterRef.current ||
      new NativeEventEmitter(
        // @ts-ignore
        Platform.OS === 'android' ? DsiEMVManagerBridge : undefined
      );
    eventEmitterRef.current = emitter;

    EVENT_NAMES.forEach((event) => {
      listenersRef.current[event] = emitter.addListener(event, (payload: any) => {
        appendLog(event, payload);
        if (event === 'onConfigPingSuccess') {
          appendLog('pingConfigResponse', 'Ping config succeeded');
        } else if (event === 'onConfigPingFailed') {
          appendLog('pingConfigResponse', 'Ping config failed');
        }
      });
    });

    // Initialize the native module on mount
    // DsiEMVManagerBridge.initialize();

    return () => {
      Object.values(listenersRef.current).forEach((listener) => {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      });
      listenersRef.current = {};
      if (DsiEMVManagerBridge && typeof DsiEMVManagerBridge.clearTransactionListener === 'function') {
        DsiEMVManagerBridge.clearTransactionListener();
      }
    };
  }, [appendLog]);

  const handleSetupConfig = useCallback(() => {
    try {
      DsiEMVManagerBridge.pingConfig();
      appendLog('pingConfig', 'Called pingConfig()');
    } catch (e) {
      appendLog('error', `pingConfig failed: ${(e as Error).message}`);
    }
  }, [appendLog]);

  const handleStartSale = useCallback(() => {
    try {
      DsiEMVManagerBridge.runSaleTransaction('10.50');
      appendLog('runSaleTransaction', 10.5);
    } catch (e) {
      appendLog('error', `runSaleTransaction failed: ${(e as Error).message}`);
    }
  }, [appendLog]);

  const handlePrepaidStripe = useCallback(() => {
    try {
      DsiEMVManagerBridge.collectCardDetails();
      appendLog('collectCardDetails', 'Requested card details');
    } catch (e) {
      appendLog('error', `collectCardDetails failed: ${(e as Error).message}`);
    }
  }, [appendLog]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EMV Payment Demo</Text>
      <View style={styles.buttonRow}>
        <Button title="Setup Configuration" onPress={handleSetupConfig} />
        <Button title="Start EMV Sale" onPress={handleStartSale} />
        <Button title="Prepaid Stripe Card" onPress={handlePrepaidStripe} />
      </View>
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

interface CardBin {
  bin: string;
  [key: string]: any;
}

interface CallbackLog {
  type: string;
  payload: any;
  timestamp: number;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
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