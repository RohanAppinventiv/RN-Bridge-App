"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var useEMVPayment_1 = require("../useEMVPayment");
var TickIcon = function () { return (react_1.default.createElement(react_native_1.Text, { style: { color: 'green', fontSize: 18, marginRight: 6 } }, "\u2714\uFE0F")); };
var CrossIcon = function () { return (react_1.default.createElement(react_native_1.Text, { style: { color: 'red', fontSize: 18, marginRight: 6 } }, "\u274C")); };
var EMVPaymentScreenExample = function () {
    // EMV Configuration - Replace with your actual values
    var emvConfig = {
        merchantID: "YOUR_MERCHANT_ID",
        onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
        isSandBox: true,
        secureDeviceName: "YOUR_DEVICE_NAME",
        operatorID: "YOUR_OPERATOR_ID" // Employee ID
    };
    var _a = (0, useEMVPayment_1.useEMVPayment)(emvConfig), logs = _a.logs, isDeviceConnected = _a.isDeviceConnected, loading = _a.loading, isInitialized = _a.isInitialized, handleCardPayment = _a.handleCardPayment, handleInHousePayment = _a.handleInHousePayment, runRecurringTransaction = _a.runRecurringTransaction, setupConfig = _a.setupConfig, clearAllTransactions = _a.clearAllTransactions, cancelOperation = _a.cancelOperation;
    return (react_1.default.createElement(react_native_1.View, { style: styles.container },
        react_1.default.createElement(react_native_1.View, { style: styles.statusRow },
            isInitialized ? react_1.default.createElement(TickIcon, null) : react_1.default.createElement(CrossIcon, null),
            react_1.default.createElement(react_native_1.Text, { style: [styles.statusLabel, { color: isInitialized ? 'green' : 'red' }] }, isInitialized ? 'Initialized' : 'Not Initialized')),
        react_1.default.createElement(react_native_1.View, { style: styles.statusRow },
            isDeviceConnected ? react_1.default.createElement(TickIcon, null) : react_1.default.createElement(CrossIcon, null),
            react_1.default.createElement(react_native_1.Text, { style: [styles.statusLabel, { color: isDeviceConnected ? 'green' : 'red' }] }, isDeviceConnected ? 'Connected' : 'Not Connected')),
        react_1.default.createElement(react_native_1.Text, { style: styles.title }, "EMV Payment Demo"),
        react_1.default.createElement(react_native_1.View, { style: styles.buttonRow },
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.ctaButton, !isDeviceConnected ? styles.ctaButtonEnabled : styles.ctaButtonDisabled], onPress: setupConfig, disabled: isDeviceConnected || loading },
                react_1.default.createElement(react_native_1.Text, { style: styles.ctaButtonText }, isDeviceConnected ? 'Configuration Ready' : 'Setup Configuration')),
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.ctaButton, (loading || !isDeviceConnected) ? styles.ctaButtonDisabled : styles.ctaButtonEnabled], onPress: function () { return handleCardPayment('1.50'); }, disabled: loading || !isDeviceConnected },
                react_1.default.createElement(react_native_1.Text, { style: styles.ctaButtonText }, "Pay via Credit Card")),
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.ctaButton, (loading || !isDeviceConnected) ? styles.ctaButtonDisabled : styles.ctaButtonEnabled], onPress: handleInHousePayment, disabled: loading || !isDeviceConnected },
                react_1.default.createElement(react_native_1.Text, { style: styles.ctaButtonText }, "Pay via In-house"))),
        react_1.default.createElement(react_native_1.View, { style: styles.buttonRow },
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.ctaButton, (loading || !isDeviceConnected) ? styles.ctaButtonDisabled : styles.ctaButtonEnabled], onPress: function () { return runRecurringTransaction('2.00'); }, disabled: loading || !isDeviceConnected },
                react_1.default.createElement(react_native_1.Text, { style: styles.ctaButtonText }, "Recurring Transaction")),
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.ctaButton, loading ? styles.ctaButtonDisabled : styles.ctaButtonEnabled], onPress: clearAllTransactions, disabled: loading },
                react_1.default.createElement(react_native_1.Text, { style: styles.ctaButtonText }, "Clear All"))),
        react_1.default.createElement(react_native_1.View, { style: styles.buttonRow },
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.ctaButton, (loading || !isDeviceConnected) ? styles.ctaButtonDisabled : styles.ctaButtonEnabled], onPress: function () { }, disabled: loading || !isDeviceConnected },
                react_1.default.createElement(react_native_1.Text, { style: styles.ctaButtonText }, "Pre Auth")),
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.ctaButton, (loading || !isDeviceConnected) ? styles.ctaButtonDisabled : styles.ctaButtonEnabled], onPress: function () { }, disabled: loading || !isDeviceConnected },
                react_1.default.createElement(react_native_1.Text, { style: styles.ctaButtonText }, "$0 Auth")),
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [styles.ctaButton, (loading || !isDeviceConnected) ? styles.ctaButtonDisabled : styles.ctaButtonEnabled], onPress: function () { }, disabled: loading || !isDeviceConnected },
                react_1.default.createElement(react_native_1.Text, { style: styles.ctaButtonText }, "Refund"))),
        react_1.default.createElement(react_native_1.Modal, { visible: loading, transparent: true, animationType: "fade", onRequestClose: cancelOperation },
            react_1.default.createElement(react_native_1.View, { style: styles.modalOverlay },
                react_1.default.createElement(react_native_1.View, { style: styles.modalContent },
                    react_1.default.createElement(react_native_1.ActivityIndicator, { size: "large", color: "#007AFF" }),
                    react_1.default.createElement(react_native_1.Text, { style: styles.modalText }, "Processing..."),
                    react_1.default.createElement(react_native_1.TouchableOpacity, { style: styles.cancelButton, onPress: cancelOperation },
                        react_1.default.createElement(react_native_1.Text, { style: styles.cancelButtonText }, "Cancel"))))),
        react_1.default.createElement(react_native_1.Text, { style: styles.logTitle }, "Event Log"),
        react_1.default.createElement(react_native_1.ScrollView, { style: styles.logArea, contentContainerStyle: styles.logContent }, logs.length === 0 ? (react_1.default.createElement(react_native_1.Text, { style: styles.logEmpty }, "No events yet.")) : (logs.map(function (log, idx) { return (react_1.default.createElement(react_native_1.View, { key: log.timestamp + idx, style: styles.logItem },
            react_1.default.createElement(react_native_1.Text, { style: styles.logType }, log.type),
            react_1.default.createElement(react_native_1.Text, { style: styles.logPayload }, typeof log.payload === 'object'
                ? JSON.stringify(log.payload, null, 2)
                : String(log.payload)),
            react_1.default.createElement(react_native_1.Text, { style: styles.logTime }, new Date(log.timestamp).toLocaleTimeString()))); })))));
};
var styles = react_native_1.StyleSheet.create({
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 20,
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
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
exports.default = EMVPaymentScreenExample;
//# sourceMappingURL=EMVPaymentScreen.js.map