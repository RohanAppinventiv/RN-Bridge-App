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
exports.useEMVPayment = exports.EVENT_NAMES = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
exports.EVENT_NAMES = [
    'onError',
    'onCardReadSuccessfully',
    'onSaleTransactionCompleted',
    'onShowMessage',
    'onConfigError',
    'onConfigPingFailed',
    'onConfigPingSuccess',
    'onConfigCompleted',
];
var useEMVPayment = function () {
    var DsiEMVManagerBridge = react_native_1.NativeModules.DsiEMVManagerBridge;
    var _a = (0, react_1.useState)([]), logs = _a[0], setLogs = _a[1];
    var _b = (0, react_1.useState)(false), isDeviceConnected = _b[0], setIsDeviceConnected = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
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
        exports.EVENT_NAMES.forEach(function (event) {
            var listener = emitter.addListener(event, function (payload) {
                var _a;
                appendLog(event, payload);
                if (event === 'onConfigPingSuccess') {
                    appendLog('pingConfigResponse', 'Ping config succeeded');
                    setIsDeviceConnected(true);
                }
                else if (event === 'onSaleTransactionCompleted') {
                    var captureStatus = payload === null || payload === void 0 ? void 0 : payload.captureStatus;
                    var amount = (_a = payload === null || payload === void 0 ? void 0 : payload.amount) === null || _a === void 0 ? void 0 : _a.purchase;
                    appendLog('saleTransaction', "Sale completed. Capture Status: ".concat(captureStatus, ", Amount: ").concat(amount));
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
                    var binNumber = payload === null || payload === void 0 ? void 0 : payload.binNumber;
                    appendLog('cardRead', 'Card read successfully And BIN: ' + binNumber);
                }
                setLoading(function () { return false; });
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
    var setupConfig = (0, react_1.useCallback)(function () {
        try {
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
    }, [appendLog]);
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
    return {
        logs: logs,
        isDeviceConnected: isDeviceConnected,
        loading: loading,
        handleCardPayment: runSaleTransaction,
        handleInHousePayment: collectCardDetails,
        setupConfig: setupConfig,
        pingConfig: pingConfig,
        clearTransactionListener: clearTransactionListener,
        subscribeToEvent: subscribeToEvent,
        unsubscribeFromEvent: unsubscribeFromEvent,
        EVENTS: Object.freeze(exports.EVENT_NAMES.reduce(function (acc, name) {
            acc[name] = name;
            return acc;
        }, {}))
    };
};
exports.useEMVPayment = useEMVPayment;
//# sourceMappingURL=useEMVPayment.js.map