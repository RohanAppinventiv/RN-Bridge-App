import React, { createContext } from "react";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";
import { CallbackLog, EMVConfig, EVENT_NAMES, EMVEventName, PaymentContextType } from "./types";
import { useCallback, useEffect, useRef, useState } from "react";


const PaymentContext = createContext<PaymentContextType | undefined>(undefined);


function PaymentProvider({ children, config, disabled = false }: {
    children: React.ReactNode,
    config: EMVConfig,
    disabled?: boolean
}) {
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
    const initializeEMV = useCallback((config: EMVConfig) => {
        if (isInitialized) {
            appendLog('initialize', 'EMV already initialized');
            setIsInitialized(true);
            setLoading(false)
            return;
        }

        try {
            setLoading(true);
            waitingForEvent.current = true;
            console.log('Initializing EMV with config:', config);
            DsiEMVManagerBridge.initialize(config);
            appendLog('Initialization', `EMV initialized with config: ${JSON.stringify(config)}`);
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
        if (disabled) {
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

                // Handle ping config responses
                if (event === 'onConfigPingSuccess') {
                    console.log('Setting device connected to TRUE');
                    appendLog('onConfigPingSuccess', 'Configuration ping successful');
                    setIsDeviceConnected(true);
                    setLoading(false);
                    waitingForEvent.current = false;
                } else if (event === 'onConfigPingFailed') {
                    appendLog('onConfigPingFailed', 'Configuration ping failed');
                    setIsDeviceConnected(false);
                    setLoading(false);
                    waitingForEvent.current = false;
                }

                // Handle setup config responses
                else if (event === 'onConfigCompleted') {
                    appendLog('setupConfigResponse', 'Setup Configured Successfully');
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
                    const {
                        cmdStatus,
                        textResponse,
                        sequenceNo,
                        userTrace,
                        acctNo,
                        cardType,
                        authCode,
                        captureStatus,
                        refNo,
                        invoiceNo,
                        amount,
                        acqRefData,
                        entryMethod,
                        date,
                        time
                    } = payload || {};

                    appendLog(
                        'Single time sale transaction completed',
                        `TransactionStatus: ${cmdStatus}\nText: ${textResponse}\nSequenceNo: ${sequenceNo}\nUserTrace: ${userTrace}\nAcctNo: ${acctNo}\ncardType: ${cardType}\nauthCode: ${authCode}\nCaptureStatus: ${captureStatus}\nRefNo: ${refNo}\nInvoiceNo: ${invoiceNo}\nAmount: ${amount?.purchase}\nAcqRefData: ${acqRefData}\nEntryMethod: ${entryMethod}\nDate: ${date}\nTime: ${time}`
                    );
                    setLoading(false);
                    waitingForEvent.current = false;
                } else if (event === 'onRecurringSaleCompleted') {
                    const {
                        cmdStatus,
                        textResponse,
                        sequenceNo,
                        userTrace,
                        captureStatus,
                        refNo,
                        invoiceNo,
                        amount,
                        cardholderName,
                        acctNo,
                        cardType,
                        authCode,
                        entryMethod,
                        recordNo,
                        recurringData,
                        acqRefData,
                        date,
                        time,
                        payAPIId
                    } = payload || {};

                    appendLog(
                        'Sale transaction with recurring data completed',
                        `TransactionStatus: ${cmdStatus}\nText: ${textResponse}\nSequenceNo: ${sequenceNo}\nUserTrace: ${userTrace}\nCaptureStatus: ${captureStatus}\nRefNo: ${refNo}\nInvoiceNo: ${invoiceNo}\nAmount: ${amount?.purchase}\n\nCardHolderName: ${cardholderName}\nAcctNo: ${acctNo}\ncardType: ${cardType}\nauthCode: ${authCode}\nEntryMethod: ${entryMethod}\n\nRecordNo: ${recordNo}\nRecurringData: ${recurringData}\n\nAcqRefData: ${acqRefData}\nDate: ${date}\nTime: ${time}\nPayAPIID: ${payAPIId}`
                    );
                    setLoading(false);
                    waitingForEvent.current = false;
                } else if (event === 'onReplaceCardCompleted') {
                    const {
                        cmdStatus,
                        textResponse,
                        sequenceNo,
                        userTrace,
                        captureStatus,
                        refNo,
                        invoiceNo,
                        amount,
                        cardholderName,
                        acctNo,
                        cardType,
                        authCode,
                        entryMethod,
                        recordNo,
                        acqRefData,
                        date,
                        time,
                        payAPIId
                    } = payload || {};

                    appendLog(
                        'Replace card in recurring transaction completed',
                        `Status: ${cmdStatus}\nResponse: ${textResponse}\nSequenceNo: ${sequenceNo}\nUserTrace: ${userTrace}\nCaptureStatus: ${captureStatus}\nRefNo: ${refNo}\nInvoiceNo: ${invoiceNo}\nAmount: ${amount?.purchase}\n\nCardHolderName: ${cardholderName}\nAcctNo: ${acctNo}\ncardType: ${cardType}\nauthCode: ${authCode}\nEntryMethod: ${entryMethod}\n\nRecordNo: ${recordNo}\n\nAcqRefData: ${acqRefData}\nDate: ${date}\nTime: ${time}\nPayAPIID: ${payAPIId}`
                    );
                    setLoading(false);
                    waitingForEvent.current = false;
                } else if (event === 'onCardReadSuccessfully') {
                    const binNumber = payload?.binNumber;
                    appendLog('Card successfully read', 'Card read successfully And BIN: ' + binNumber);
                    setLoading(false);
                    waitingForEvent.current = false;
                } else if (event === 'onError') {
                    appendLog('Error:', payload);
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
            initializeEMV(config);
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
    }, [appendLog, disabled]);

    // Export the specific functions from DsiEMVManagerBridge
    const runSaleTransaction = useCallback((amount: string) => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.runSaleTransaction(amount);
            appendLog('Running Single time sale transaction', `Amount: ${amount}`);
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
            appendLog('Running Card Details Collection', 'Requested card details');
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
            appendLog('Running a sale transaction with recurring data', `Amount: ${amount}`);
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `runRecurringTransaction failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    const replaceCardInRecurring = useCallback(() => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.replaceCardInRecurring();
            appendLog('Running replace card in recurring', 'Replacing card in recurring transaction');
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `replaceCardInRecurring failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    const setupConfig = useCallback(() => {
        try {
            if (!isInitialized) {
                appendLog('setupConfig', 'EMV not initialized. Initializing first...');
                initializeEMV(config);
                return;
            }

            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.setupConfig();
            appendLog('setupConfig', 'Setting up configurations....');
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
            appendLog('Ping Device', 'Checking Device Status');
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `Pinging Device failed: ${(e as Error).message}`);
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
            appendLog('Clearing All Logs', 'All logs cleared');
        } catch (e) {
            appendLog('error', `Clearing All Transactions failed: ${(e as Error).message}`);
        }
    }, [appendLog]);

    // Cancel current operation
    const cancelOperation = useCallback(() => {
        try {
            DsiEMVManagerBridge.cancelTransaction();
            setLoading(false);
            waitingForEvent.current = false;
        } catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `cancelOperation failed: ${(e as Error).message}`);
        }
    }, [appendLog]);
    return (
        <PaymentContext.Provider value={{
            logs,
            isDeviceConnected,
            loading,
            isInitialized,
            handleCardPayment: runSaleTransaction,
            handleInHousePayment: collectCardDetails,
            runRecurringTransaction,
            replaceCardInRecurring,
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

        }}>
            {children}
        </PaymentContext.Provider>
    );
}

export { PaymentProvider };
export { PaymentContext };