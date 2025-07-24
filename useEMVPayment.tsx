import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

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

interface CallbackLog {
    type: string;
    payload: any;
    timestamp: number;
}

const useEMVPayment = () => {
    const [logs, setLogs] = useState<CallbackLog[]>([]);
    const [isDeviceConnected, setIsDeviceConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
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
                appendLog(event, payload);
                if (event === 'onConfigPingSuccess') {
                    appendLog('pingConfigResponse', 'Ping config succeeded');
                    setIsDeviceConnected(true);
                } else if (event === 'onSaleTransactionCompleted') {
                    const captureStatus = payload?.captureStatus;
                    const amount = payload?.amount?.purchase;

                    appendLog(
                        'saleTransaction',
                        `Sale completed. Capture Status: ${captureStatus}, Amount: ${amount}`
                    );

                } else if (event === 'onConfigPingFailed') {
                    appendLog('pingConfigResponse', 'Ping config failed');
                    setIsDeviceConnected(false);
                } else if (event === 'onConfigCompleted') {
                    setIsDeviceConnected(true);
                } else if (event === 'onConfigError') {
                    setIsDeviceConnected(false);
                } else if (event === 'onCardReadSuccessfully') {
                    const binNumber = payload?.binNumber;
                    appendLog('cardRead', 'Card read successfully And BIN: ' + binNumber);
                }
                setLoading(() => false);
                waitingForEvent.current = false;
            });

            // Store the listener in the ref
            if (!listenersRef.current[event]) {
                listenersRef.current[event] = [];
            }
            listenersRef.current[event].push(listener);
        });

        // Initial ping config call
        setLoading(true);
        waitingForEvent.current = true;
        DsiEMVManagerBridge.pingConfig();

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

    const setupConfig = useCallback(() => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.setupConfig();
            appendLog('setupConfig', 'Called setupConfig()');
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `setupConfig failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

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

    // Return only the exported functions
    return {
        logs,
        isDeviceConnected,
        loading,
        runSaleTransaction,
        collectCardDetails,
        setupConfig,
        pingConfig,
        clearTransactionListener,
        subscribeToEvent,
        unsubscribeFromEvent,
        EVENTS: Object.freeze(
            EVENT_NAMES.reduce((acc: Record<string, string>, name) => {
                acc[name] = name;
                return acc;
            }, {})
        )
    };
};

export default useEMVPayment;
