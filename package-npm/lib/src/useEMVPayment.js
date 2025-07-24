"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const { DsiEMVManagerBridge } = react_native_1.NativeModules;
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
const useEMVPayment = () => {
    const [logs, setLogs] = (0, react_1.useState)([]);
    const [isDeviceConnected, setIsDeviceConnected] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const eventEmitterRef = (0, react_1.useRef)(null);
    const listenersRef = (0, react_1.useRef)({}); // Now it's an array of listeners for each event
    const waitingForEvent = (0, react_1.useRef)(false);
    const appendLog = (0, react_1.useCallback)((type, payload) => {
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
    const subscribeToEvent = (0, react_1.useCallback)((eventName, callback) => {
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
    const unsubscribeFromEvent = (0, react_1.useCallback)((eventName, callback) => {
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
    (0, react_1.useEffect)(() => {
        if (!DsiEMVManagerBridge) {
            console.error('Native module DsiEMVManagerBridge not found');
            return;
        }
        const emitter = eventEmitterRef.current ||
            new react_native_1.NativeEventEmitter(react_native_1.Platform.OS === 'android' ? DsiEMVManagerBridge : undefined);
        eventEmitterRef.current = emitter;
        // Subscribe to all events initially
        EVENT_NAMES.forEach((event) => {
            const listener = emitter.addListener(event, (payload) => {
                var _a;
                appendLog(event, payload);
                if (event === 'onConfigPingSuccess') {
                    appendLog('pingConfigResponse', 'Ping config succeeded');
                    setIsDeviceConnected(true);
                }
                else if (event === 'onSaleTransactionCompleted') {
                    const captureStatus = payload === null || payload === void 0 ? void 0 : payload.captureStatus;
                    const amount = (_a = payload === null || payload === void 0 ? void 0 : payload.amount) === null || _a === void 0 ? void 0 : _a.purchase;
                    appendLog('saleTransaction', `Sale completed. Capture Status: ${captureStatus}, Amount: ${amount}`);
                }
                else if (event === 'onConfigPingFailed') {
                    appendLog('pingConfigResponse', 'Ping config failed');
                    setIsDeviceConnected(false);
                }
                else if (event === 'onConfigCompleted') {
                    setIsDeviceConnected(true);
                }
                else if (event === 'onConfigError') {
                    setIsDeviceConnected(false);
                }
                else if (event === 'onCardReadSuccessfully') {
                    const binNumber = payload === null || payload === void 0 ? void 0 : payload.binNumber;
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
    const runSaleTransaction = (0, react_1.useCallback)((amount) => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.runSaleTransaction(amount);
            appendLog('runSaleTransaction', `Amount: ${amount}`);
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `runSaleTransaction failed: ${e.message}`);
        }
    }, [appendLog]);
    const collectCardDetails = (0, react_1.useCallback)(() => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.collectCardDetails();
            appendLog('collectCardDetails', 'Requested card details');
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `collectCardDetails failed: ${e.message}`);
        }
    }, [appendLog]);
    const setupConfig = (0, react_1.useCallback)(() => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.setupConfig();
            appendLog('setupConfig', 'Called setupConfig()');
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `setupConfig failed: ${e.message}`);
        }
    }, [appendLog]);
    const pingConfig = (0, react_1.useCallback)(() => {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.pingConfig();
            appendLog('pingConfig', 'Ping config initiated');
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', `pingConfig failed: ${e.message}`);
        }
    }, [appendLog]);
    const clearTransactionListener = (0, react_1.useCallback)(() => {
        try {
            DsiEMVManagerBridge.clearTransactionListener();
            appendLog('clearTransactionListener', 'Cleared transaction listener');
        }
        catch (e) {
            appendLog('error', `clearTransactionListener failed: ${e.message}`);
        }
    }, [appendLog]);
    // Return only the exported functions
    return {
        logs,
        isDeviceConnected,
        loading,
        handleCardPayment: runSaleTransaction,
        handleInHousePayment: collectCardDetails,
        setupConfig,
        pingConfig,
        clearTransactionListener,
        subscribeToEvent,
        unsubscribeFromEvent,
        EVENTS: Object.freeze(EVENT_NAMES.reduce((acc, name) => {
            acc[name] = name;
            return acc;
        }, {}))
    };
};
exports.default = useEMVPayment;
