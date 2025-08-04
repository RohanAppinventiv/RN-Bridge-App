import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { CallbackLog, EMVEventName, EMVPaymentHook, EVENT_NAMES, EMVConfig } from './types';

export const useEMVPayment = (config: EMVConfig): EMVPaymentHook => {
    const { DsiEMVManagerBridge } = NativeModules;

    const [logs, setLogs] = useState<CallbackLog[]>([]);
    const [isDeviceConnected, setIsDeviceConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const eventEmitterRef = useRef<NativeEventEmitter | null>(null);
    const listenersRef = useRef<{ [event: string]: any[] }>({}); // Now it's an array of listeners for each event
    const waitingForEvent = useRef(false);

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

    // Initialize the EMV manager with configuration data (called only once)
    const initializeEMV = useCallback(() => {
        if (isInitialized) {
            appendLog('initialize', 'EMV already initialized');
            return;
        }

        try {
            setLoading(true);
            waitingForEvent.current = true;

            DsiEMVManagerBridge.initialize(config);
            appendLog('initialize', `EMV initialized with config: ${JSON.stringify(config)}`);
            setIsInitialized(true);

        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `initialize failed: ${(e as Error).message}`);
        }
    }, [isInitialized, appendLog, config]);

    // Event subscription functions
    const subscribeToEvent = useCallback((eventName: string, callback: (payload: any) => void) => {
        if (eventEmitterRef.current) {
            const listener = eventEmitterRef.current.addListener(eventName, callback);

            // Store listener in the ref object
            if (!listenersRef.current[eventName]) {
                listenersRef.current[eventName] = [];
            }
            listenersRef.current[eventName].push(listener);

            return listener; // Return listener for potential removal later
        }
    }, []);

    const unsubscribeFromEvent = useCallback((eventName: string, callback: (payload: any) => void) => {
        const listeners = listenersRef.current[eventName];
        if (listeners) {
            const listener = listeners.find((listener) => listener.listener === callback);
            if (listener) {
                listener.remove();

                // Remove the listener from the stored list
                listenersRef.current[eventName] = listeners.filter((l) => l !== listener);
            }
        }
    }, []);

    useEffect(() => {
        if (!DsiEMVManagerBridge) {
            console.error('Native module DsiEMVManagerBridge not found');
            return;
        }

        const emitter =
            eventEmitterRef.current ||
            new NativeEventEmitter(Platform.OS === 'android' ? DsiEMVManagerBridge : undefined);
        eventEmitterRef.current = emitter;

        // Subscribe to all events initially
        EVENT_NAMES.forEach((event) => {
            const listener = emitter.addListener(event, (payload: any) => {
                console.log(`React Native received event: ${event}`, payload);
                appendLog(event, payload);

                // Handle ping config responses
                if (event === 'onConfigPingSuccess') {
                    console.log('Setting device connected to TRUE');
                    appendLog('pingConfigResponse', 'Ping config succeeded');
                    setIsDeviceConnected(true);
                    setLoading(false);
                    waitingForEvent.current = false;
                } else if (event === 'onConfigPingFailed') {
                    appendLog('pingConfigResponse', 'Ping config failed');
                    setIsDeviceConnected(false);
                    setLoading(false);
                    waitingForEvent.current = false;
                }

                // Handle setup config responses
                else if (event === 'onConfigCompleted') {
                    appendLog('setupConfigResponse', 'Setup config completed');
                    setIsDeviceConnected(true);
                    setLoading(false);
                    waitingForEvent.current = false;
                } else if (event === 'onConfigError') {
                    appendLog('setupConfigResponse', 'Setup config failed');
                    setIsDeviceConnected(false);
                    setLoading(false);
                    waitingForEvent.current = false;
                }

                // Handle other events
                else if (event === 'onSaleTransactionCompleted') {
                    const captureStatus = payload?.captureStatus;
                    const amount = payload?.amount?.purchase;
                    appendLog(
                        'saleTransaction',
                        `Sale completed. Capture Status: ${captureStatus}, Amount: ${amount}`
                    );
                    setLoading(false);
                    waitingForEvent.current = false;
                } else if (event === 'onCardReadSuccessfully') {
                    const binNumber = payload?.binNumber;
                    appendLog('cardRead', 'Card read successfully And BIN: ' + binNumber);
                    setLoading(false);
                    waitingForEvent.current = false;
                } else if (event === 'onError') {
                    appendLog('error', `Native error: ${payload}`);
                    setLoading(false);
                    waitingForEvent.current = false;
                } else {
                    // For other events, clear loading state
                    setLoading(false);
                    waitingForEvent.current = false;
                }
            });

            // Store the listener in the ref
            if (!listenersRef.current[event]) {
                listenersRef.current[event] = [];
            }
            listenersRef.current[event].push(listener);
        });

        // Initialize EMV manager first (only once)
        if (config)
            initializeEMV();
        else
            console.error("MISSING CONFIGURATION for INITIALIZATION");

        // After initialization, call pingConfig to check connection
        setTimeout(() => {
            pingConfig();
        }, 1000);

        // Clean up listeners when the component is unmounted
        return () => {
            Object.values(listenersRef.current).forEach((eventListeners) => {
                eventListeners.forEach((listener) => listener.remove());
            });
            listenersRef.current = {};
            if (DsiEMVManagerBridge && typeof DsiEMVManagerBridge.clearTransactionListener === 'function') {
                DsiEMVManagerBridge.clearTransactionListener();
            }
        };
    }, [appendLog]);

    // Export the specific functions from DsiEMVManagerBridge
    const runSaleTransaction = useCallback((amount: string) => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.runSaleTransaction(amount);
            appendLog('runSaleTransaction', `Amount: ${amount}`);
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `runSaleTransaction failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    const collectCardDetails = useCallback(() => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.collectCardDetails();
            appendLog('collectCardDetails', 'Requested card details');
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `collectCardDetails failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    const runRecurringTransaction = useCallback((amount: string) => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.runRecurringTransaction(amount);
            appendLog('runRecurringTransaction', `Amount: ${amount}`);
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `runRecurringTransaction failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    const setupConfig = useCallback(() => {
        try {
            if (!isInitialized) {
                appendLog('setupConfig', 'EMV not initialized. Initializing first...');
                initializeEMV();
                return;
            }

            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.setupConfig();
            appendLog('setupConfig', 'Called setupConfig()');
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `setupConfig failed: ${(e as Error).message}`);
        }
    }, [appendLog, isInitialized, initializeEMV]);

    const pingConfig = useCallback(() => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.pingConfig();
            appendLog('pingConfig', 'Ping config initiated');
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `pingConfig failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    const clearTransactionListener = useCallback(() => {
        try {
            DsiEMVManagerBridge.clearTransactionListener();
            appendLog('clearTransactionListener', 'Cleared transaction listener');
        } catch (e) {
            appendLog('error', `clearTransactionListener failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    // Clear all logs only
    const clearAllTransactions = useCallback(() => {
        try {
            // Clear logs only
            setLogs([]);
            appendLog('clearAllTransactions', 'All logs cleared');
        } catch (e) {
            appendLog('error', `clearAllTransactions failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    // Cancel current operation
    const cancelOperation = useCallback(() => {
        try {
            DsiEMVManagerBridge.cancelTransaction();
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('cancelOperation', 'Operation cancelled by user');
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `cancelOperation failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    return {
        logs,
        isDeviceConnected,
        loading,
        isInitialized,
        handleCardPayment: runSaleTransaction,
        handleInHousePayment: collectCardDetails,
        runRecurringTransaction,
        setupConfig,
        pingConfig,
        clearTransactionListener,
        clearAllTransactions,
        cancelOperation,
        initializeEMV,
        subscribeToEvent,
        unsubscribeFromEvent,
        EVENTS: Object.freeze(
            EVENT_NAMES.reduce((acc: Record<EMVEventName, EMVEventName>, name) => {
                acc[name] = name;
                return acc;
            }, {} as Record<EMVEventName, EMVEventName>)
        )
    };
};