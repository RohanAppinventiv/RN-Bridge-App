import { EMVConfig } from "../types";

export const emvConfig: EMVConfig = {
    merchantID: "SONNYTAMA35000GP",
    onlineMerchantID: "SONNYTAMA35000EP",
    isSandBox: true, // true for testing, false for production
    secureDeviceName: "EMV_VP3350_DATACAP", // Terminal device name
    operatorID: "001", // Employee ID
    posPackageID: "com.quivio.app:1.0.0" // App Bundle ID
};