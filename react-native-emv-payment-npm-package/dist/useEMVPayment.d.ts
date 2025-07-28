export declare const EVENT_NAMES: readonly ["onError", "onCardReadSuccessfully", "onSaleTransactionCompleted", "onShowMessage", "onConfigError", "onConfigPingFailed", "onConfigPingSuccess", "onConfigCompleted"];
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
    handleCardPayment: (amount: string) => void;
    handleInHousePayment: () => void;
    setupConfig: () => void;
    pingConfig: () => void;
    clearTransactionListener: () => void;
    subscribeToEvent: (eventName: EMVEventName, callback: (payload: any) => void) => void;
    unsubscribeFromEvent: (eventName: EMVEventName, callback: (payload: any) => void) => void;
    EVENTS: Record<EMVEventName, EMVEventName>;
}
export declare const useEMVPayment: () => EMVPaymentHook;
