export const EVENT_NAMES = [
    'onError',
    'onCardReadSuccessfully',
    'onSaleTransactionCompleted',
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
    setupConfig: () => void;
    pingConfig: () => void;
    clearTransactionListener: () => void;
    clearAllTransactions: () => void;
    cancelOperation: () => void;
    initializeEMV: () => void;
    subscribeToEvent: (eventName: EMVEventName, callback: (payload: any) => void) => void;
    unsubscribeFromEvent: (eventName: EMVEventName, callback: (payload: any) => void) => void;
    EVENTS: Record<EMVEventName, EMVEventName>;
}