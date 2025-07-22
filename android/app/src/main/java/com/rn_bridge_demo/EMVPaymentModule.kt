package com.rn_bridge_demo

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.ReadableMap
import com.quivioedge.emvlib.pos.CardBin
import com.quivioedge.emvlib.pos.EMVBridge
import com.quivioedge.emvlib.pos.EMVBridgeCallback
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class EMVPaymentModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext),EMVBridgeCallback {

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
        emvBridge = EMVBridge.initialise(activity, posConfig, this)
    }

    @ReactMethod
    fun startEMVTransaction(amount: Double) {
        CoroutineScope(Dispatchers.Main).launch {
            emvBridge.startEMVSaleTransaction(amount)
        }
    }

    @ReactMethod
    fun getCardDetails() {
        CoroutineScope(Dispatchers.Main).launch {
            emvBridge.collectEMVCardData()
        }
    }

    @ReactMethod
    fun cancelTransaction() {
        CoroutineScope(Dispatchers.Main).launch {
            emvBridge.clearAllListeners()
        }
    }

    @ReactMethod
    fun printReceipt(str: String) {
        CoroutineScope(Dispatchers.Main).launch {
            emvBridge.printReceipt(str)
        }
    }

    override fun onDataReceived(cardBin: CardBin) {
        Log.d("TAG", "onDataReceived: $cardBin")
    }

    override fun onCardFailed(message: String) {
    }

    override fun onTransactionSuccessFull(message: String) {
    }

    override fun onTransactionSFailed(message: String) {
    }

    override fun askToPrintReceipt(printBody: String) {
    }

    override fun onAlertReceived(message: String) {
        Log.d("TAG", "EMVPaymentModule onAlertReceived: $message")
    }

    override fun onWarningReceived(message: String) {
    }

    private fun sendEvent(eventName: String, params: Any?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}