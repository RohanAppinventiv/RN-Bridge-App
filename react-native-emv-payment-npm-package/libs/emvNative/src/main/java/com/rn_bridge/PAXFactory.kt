package com.rn_bridge

import com.facebook.react.bridge.ReadableMap
import com.quivioedge.emvlib.pos.models.PAXConfig

class PAXFactory {
    private class ConfigDTO(
            override val merchantID: String,
            override val pinPadIPAddress: String,
            override val pinPadIPPort: String,
            override val isSandBox: Boolean, // true then "CERT" else "PROD"
            override val secureDeviceName: String, // Terminal device name
            override val operatorID: String // employee id
    ) : PAXConfig

    companion object {
        /** Public entry point: build from RN’s ReadableMap */
        fun processMap(map: ReadableMap): PAXConfig {
            return ConfigDTO(
                    merchantID = map.getStringOrThrow("merchantID"),
                    pinPadIPAddress = map.getStringOrThrow("pinPadIPAddress"),
                    pinPadIPPort = map.getStringOrThrow("pinPadIPPort"),
                    isSandBox = map.getBooleanOrDefault("isSandBox", true),
                    secureDeviceName = map.getStringOrThrow("secureDeviceName"),
                    operatorID = map.getStringOrThrow("operatorID")
            )
        }

        /** Throws if the key is missing or not a String */
        private fun ReadableMap.getStringOrThrow(key: String): String =
                if (hasKey(key) && !isNull(key)) getString(key)!!
                else throw IllegalArgumentException("Missing or invalid key: $key")

        /** Returns the boolean value if present, otherwise `default` */
        private fun ReadableMap.getBooleanOrDefault(key: String, default: Boolean): Boolean =
                if (hasKey(key) && !isNull(key)) getBoolean(key) else default
    }
}
