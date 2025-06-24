package com.rn_bridge_demo

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.quivioedge.emvlib.pos.EMVBridge
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class EMVPaymentModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "EMVPayment"
    }

    private lateinit var emvBridge: EMVBridge

    override fun getName() = NAME

    @ReactMethod
    fun initPAXConfig(map: ReadableMap){
        val posConfig = PAXFactory.processMap(map)
        val activity = currentActivity ?: run {
            throw UninitializedPropertyAccessException("EMVPaymentModule: React activity hasn't been initialised ")
            return
        }
        emvBridge = EMVBridge.initialise(activity, posConfig)
    }

    @ReactMethod
    fun startEMVTransaction(amount: Double, promise: Promise) {
        try {
            emvBridge.startEMVSaleTransaction()
            promise.resolve("Transaction started")
        } catch (e: Exception) {
            promise.reject("TRANSACTION_ERROR", e)
        }
    }

    @ReactMethod
    fun getCardDetails(promise: Promise) {
        CoroutineScope(Dispatchers.Main).launch {
            try {
                emvBridge.collectEMVCardData()
                promise.resolve("Card details collected")
            } catch (e: Exception) {
                promise.reject("CARD_ERROR", e)
            }
        }
    }

    @ReactMethod
    fun cancelTransaction(promise: Promise) {
        promise.resolve(true)
    }

    @ReactMethod
    fun printReceipt(str: String, promise: Promise) {
        CoroutineScope(Dispatchers.Main).launch {
            try {
                emvBridge.printReceipt(str)
                promise.resolve("Printing Done!")
            } catch (e: Exception) {
                promise.reject("PRINTING_ERROR", e)
            }
        }
    }
}