"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEMVPayment = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var types_1 = require("./types");
var useEMVPayment = function (config) {
    var DsiEMVManagerBridge = react_native_1.NativeModules.DsiEMVManagerBridge;
    var _a = (0, react_1.useState)([]), logs = _a[0], setLogs = _a[1];
    var _b = (0, react_1.useState)(false), isDeviceConnected = _b[0], setIsDeviceConnected = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(false), isInitialized = _d[0], setIsInitialized = _d[1];
    var eventEmitterRef = (0, react_1.useRef)(null);
    var listenersRef = (0, react_1.useRef)({}); // Now it's an array of listeners for each event
    var waitingForEvent = (0, react_1.useRef)(false);
    var appendLog = (0, react_1.useCallback)(function (type, payload) {
        setLogs(function (prev) { return __spreadArray([
            {
                type: type,
                payload: payload,
                timestamp: Date.now(),
            }
        ], prev, true); });
    }, []);
    // Initialize the EMV manager with configuration data (called only once)
    var initializeEMV = (0, react_1.useCallback)(function () {
        if (isInitialized) {
            appendLog('initialize', 'EMV already initialized');
            return;
        }
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.initialize(config);
            appendLog('initialize', "EMV initialized with config: ".concat(JSON.stringify(config)));
            setIsInitialized(true);
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', "initialize failed: ".concat(e.message));
        }
    }, [isInitialized, appendLog, config]);
    // Event subscription functions
    var subscribeToEvent = (0, react_1.useCallback)(function (eventName, callback) {
        if (eventEmitterRef.current) {
            var listener = eventEmitterRef.current.addListener(eventName, callback);
            // Store listener in the ref object
            if (!listenersRef.current[eventName]) {
                listenersRef.current[eventName] = [];
            }
            listenersRef.current[eventName].push(listener);
            return listener; // Return listener for potential removal later
        }
    }, []);
    var unsubscribeFromEvent = (0, react_1.useCallback)(function (eventName, callback) {
        var listeners = listenersRef.current[eventName];
        if (listeners) {
            var listener_1 = listeners.find(function (listener) { return listener.listener === callback; });
            if (listener_1) {
                listener_1.remove();
                // Remove the listener from the stored list
                listenersRef.current[eventName] = listeners.filter(function (l) { return l !== listener_1; });
            }
        }
    }, []);
    (0, react_1.useEffect)(function () {
        if (!DsiEMVManagerBridge) {
            console.error('Native module DsiEMVManagerBridge not found');
            return;
        }
        var emitter = eventEmitterRef.current ||
            new react_native_1.NativeEventEmitter(react_native_1.Platform.OS === 'android' ? DsiEMVManagerBridge : undefined);
        eventEmitterRef.current = emitter;
        // Subscribe to all events initially
        types_1.EVENT_NAMES.forEach(function (event) {
            var listener = emitter.addListener(event, function (payload) {
                var _a;
                console.log("React Native received event: ".concat(event), payload);
                appendLog(event, payload);
                // Handle ping config responses
                if (event === 'onConfigPingSuccess') {
                    console.log('Setting device connected to TRUE');
                    appendLog('pingConfigResponse', 'Ping config succeeded');
                    setIsDeviceConnected(true);
                    setLoading(false);
                    waitingForEvent.current = false;
                }
                else if (event === 'onConfigPingFailed') {
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
                }
                else if (event === 'onConfigError') {
                    appendLog('setupConfigResponse', 'Setup config failed');
                    setIsDeviceConnected(false);
                    setLoading(false);
                    waitingForEvent.current = false;
                }
                // Handle other events
                else if (event === 'onSaleTransactionCompleted') {
                    var captureStatus = payload === null || payload === void 0 ? void 0 : payload.captureStatus;
                    var amount = (_a = payload === null || payload === void 0 ? void 0 : payload.amount) === null || _a === void 0 ? void 0 : _a.purchase;
                    appendLog('saleTransaction', "Sale completed. Capture Status: ".concat(captureStatus, ", Amount: ").concat(amount));
                    setLoading(false);
                    waitingForEvent.current = false;
                }
                else if (event === 'onCardReadSuccessfully') {
                    var binNumber = payload === null || payload === void 0 ? void 0 : payload.binNumber;
                    appendLog('cardRead', 'Card read successfully And BIN: ' + binNumber);
                    setLoading(false);
                    waitingForEvent.current = false;
                }
                else if (event === 'onError') {
                    appendLog('error', "Native error: ".concat(payload));
                    setLoading(false);
                    waitingForEvent.current = false;
                }
                else {
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
        setTimeout(function () {
            pingConfig();
        }, 1000);
        // Clean up listeners when the component is unmounted
        return function () {
            Object.values(listenersRef.current).forEach(function (eventListeners) {
                eventListeners.forEach(function (listener) { return listener.remove(); });
            });
            listenersRef.current = {};
            if (DsiEMVManagerBridge && typeof DsiEMVManagerBridge.clearTransactionListener === 'function') {
                DsiEMVManagerBridge.clearTransactionListener();
            }
        };
    }, [appendLog]);
    // Export the specific functions from DsiEMVManagerBridge
    var runSaleTransaction = (0, react_1.useCallback)(function (amount) {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.runSaleTransaction(amount);
            appendLog('runSaleTransaction', "Amount: ".concat(amount));
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', "runSaleTransaction failed: ".concat(e.message));
        }
    }, [appendLog]);
    var collectCardDetails = (0, react_1.useCallback)(function () {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.collectCardDetails();
            appendLog('collectCardDetails', 'Requested card details');
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', "collectCardDetails failed: ".concat(e.message));
        }
    }, [appendLog]);
    var runRecurringTransaction = (0, react_1.useCallback)(function (amount) {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.runRecurringTransaction(amount);
            appendLog('runRecurringTransaction', "Amount: ".concat(amount));
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', "runRecurringTransaction failed: ".concat(e.message));
        }
    }, [appendLog]);
    var setupConfig = (0, react_1.useCallback)(function () {
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
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', "setupConfig failed: ".concat(e.message));
        }
    }, [appendLog, isInitialized, initializeEMV]);
    var pingConfig = (0, react_1.useCallback)(function () {
        try {
            setLoading(true);
            waitingForEvent.current = true;
            DsiEMVManagerBridge.pingConfig();
            appendLog('pingConfig', 'Ping config initiated');
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', "pingConfig failed: ".concat(e.message));
        }
    }, [appendLog]);
    var clearTransactionListener = (0, react_1.useCallback)(function () {
        try {
            DsiEMVManagerBridge.clearTransactionListener();
            appendLog('clearTransactionListener', 'Cleared transaction listener');
        }
        catch (e) {
            appendLog('error', "clearTransactionListener failed: ".concat(e.message));
        }
    }, [appendLog]);
    // Clear all logs only
    var clearAllTransactions = (0, react_1.useCallback)(function () {
        try {
            // Clear logs only
            setLogs([]);
            appendLog('clearAllTransactions', 'All logs cleared');
        }
        catch (e) {
            appendLog('error', "clearAllTransactions failed: ".concat(e.message));
        }
    }, [appendLog]);
    // Cancel current operation
    var cancelOperation = (0, react_1.useCallback)(function () {
        try {
            DsiEMVManagerBridge.cancelTransaction();
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('cancelOperation', 'Operation cancelled by user');
        }
        catch (e) {
            setLoading(false);
            waitingForEvent.current = false;
            appendLog('error', "cancelOperation failed: ".concat(e.message));
        }
    }, [appendLog]);
    return {
        logs: logs,
        isDeviceConnected: isDeviceConnected,
        loading: loading,
        isInitialized: isInitialized,
        handleCardPayment: runSaleTransaction,
        handleInHousePayment: collectCardDetails,
        runRecurringTransaction: runRecurringTransaction,
        setupConfig: setupConfig,
        pingConfig: pingConfig,
        clearTransactionListener: clearTransactionListener,
        clearAllTransactions: clearAllTransactions,
        cancelOperation: cancelOperation,
        initializeEMV: initializeEMV,
        subscribeToEvent: subscribeToEvent,
        unsubscribeFromEvent: unsubscribeFromEvent,
        EVENTS: Object.freeze(types_1.EVENT_NAMES.reduce(function (acc, name) {
            acc[name] = name;
            return acc;
        }, {}))
    };
};
exports.useEMVPayment = useEMVPayment;
//# sourceMappingURL=useEMVPayment.js.map