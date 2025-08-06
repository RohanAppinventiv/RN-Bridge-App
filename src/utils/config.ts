import { EMVConfig } from "../types";

export const emvConfig: EMVConfig = {
    merchantID: "YOUR_MERCHANT_ID",
    onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
    isSandBox: true, // true for testing, false for production
    secureDeviceName: "SECURE_DEVICE_NAME", // Terminal device name
    operatorID: "EMPLOYEE_ID", // Employee ID
    posPackageID: "PACKAGE_NAME_AND_VERSION" // App Bundle ID
};
