interface CallbackLog {
    type: string;
    payload: any;
    timestamp: number;
}
declare const useEMVPayment: () => {
    logs: CallbackLog[];
    isDeviceConnected: boolean;
    loading: boolean;
    handleCardPayment: (amount: string) => void;
    handleInHousePayment: () => void;
    setupConfig: () => void;
    pingConfig: () => void;
    clearTransactionListener: () => void;
    subscribeToEvent: (eventName: string, callback: (payload: any) => void) => import("react-native").EmitterSubscription | undefined;
    unsubscribeFromEvent: (eventName: string, callback: (payload: any) => void) => void;
    EVENTS: Readonly<Record<string, string>>;
};
export default useEMVPayment;
