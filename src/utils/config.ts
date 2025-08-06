import { EMVConfig } from "../types";

export const emvConfig: EMVConfig = {
    merchantID: "YOUR_MERCHANT_ID",
    onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
    isSandBox: true, // true for testing, false for production
    secureDeviceName: "YOUR_DEVICE_NAME", // Terminal device name
    operatorID: "YOUR_OPERATOR_ID", // Employee ID
    posPackageID: "YOUR_POS_PACKAGE_ID" // App Bundle ID
};