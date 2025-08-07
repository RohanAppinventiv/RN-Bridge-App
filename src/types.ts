export const EVENT_NAMES = [
    'onError',
    'onCardReadSuccessfully',
    'onSaleTransactionCompleted',
    'onRecurringSaleCompleted',
    'onReplaceCardCompleted',
    'onShowMessage',
    'onConfigError',
    'onConfigPingFailed',
    'onConfigPingSuccess',
    'onConfigCompleted',
] as const;

export type EMVEventName = typeof EVENT_NAMES[number];

export interface CallbackLog {
    type: string;
    payload: any;
    timestamp: number;
}

export interface EMVPaymentHook {
    logs: CallbackLog[];
    isDeviceConnected: boolean;
    loading: boolean;
    isInitialized: boolean;
    handleCardPayment: (amount: string) => void;
    handleInHousePayment: () => void;
    runRecurringTransaction: (amount: string) => void;
    replaceCardInRecurring: () => void;
    setupConfig: () => void;
    pingConfig: () => void;
    clearTransactionListener: () => void;
    clearAllTransactions: () => void;
    cancelOperation: () => void;
    initializeEMV: (config: EMVConfig) => void;
    subscribeToEvent: (eventName: EMVEventName, callback: (payload: any) => void) => void;
    unsubscribeFromEvent: (eventName: EMVEventName, callback: (payload: any) => void) => void;
    EVENTS: Record<EMVEventName, EMVEventName>;
}

export interface PaymentContextType extends EMVPaymentHook { }

export interface EMVConfig {
    merchantID: string;
    onlineMerchantID: string;
    isSandBox: boolean;
    secureDeviceName: string;
    operatorID: string;
    posPackageID: string;
}