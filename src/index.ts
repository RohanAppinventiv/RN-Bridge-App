
import EMVPaymentScreenExample from './example/EMVPaymentScreen';
import { PaymentProvider } from './PaymentProvider';
import { useEMVPayment } from './useEMVPayment';

export type { EMVEventName, CallbackLog, EMVPaymentHook, EMVConfig } from './types';

export {
    EMVPaymentScreenExample,
    PaymentProvider,
    useEMVPayment
};

export default PaymentProvider;