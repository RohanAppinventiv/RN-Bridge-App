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