import { useContext } from "react";
import { PaymentContextType } from "./types";
import { PaymentContext } from "./PaymentProvider";

// Custom hook to use the payment context
export const useEMVPayment = (): PaymentContextType => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('useEMVPayment must be used within a PaymentProvider');
    }
    return context;
};