package com.quivioedge.emvlib.pos.models

interface PAXConfig {
    val merchantID: String
    val pinPadIPAddress: String
    val pinPadIPPort: String
    val isSandBox: Boolean
    val secureDeviceName: String
    val operatorID: String
}
