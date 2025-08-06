package com.rohan.emvcardreaderlib

interface ConfigFactory {
    val merchantID: String
    val onlineMerchantID: String
    val isSandBox: Boolean
    val secureDeviceName: String
    val operatorID: String
    val posPackageID: String
}