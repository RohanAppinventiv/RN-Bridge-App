package com.rn_bridge_demo

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.rohan.emvcardreaderlib.manager.DsiEMVManager
import com.rohan.emvcardreaderlib.EMVTransactionCommunicator
import com.rohan.emvcardreaderlib.ConfigurationCommunicator
import com.rohan.emvcardreaderlib.CardData
import com.rohan.emvcardreaderlib.SaleTransactionResponse
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class DsiEMVManagerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), EMVTransactionCommunicator, ConfigurationCommunicator {

    companion object {
        const val NAME = "DsiEMVManagerBridge"
    }

    private var dsiEMVManager: DsiEMVManager? = null

    override fun getName() = NAME

    @ReactMethod
    fun initialize(map: ReadableMap) {
        Log.d("DsiEMVManagerModule", "initialize called with config: $map")
        val config = POSConfigFactory.processMap(map)
        val context = currentActivity ?: reactContext
        dsiEMVManager = DsiEMVManager(context, config)
        dsiEMVManager?.registerListener(this, this)
        Log.d("DsiEMVManagerModule", "initialize completed")
    }

    @ReactMethod
    fun runSaleTransaction(amount: String) {
        CoroutineScope(Dispatchers.Main).launch {
            dsiEMVManager?.runSaleTransaction(amount)
        }
    }

    @ReactMethod
    fun collectCardDetails() {
        CoroutineScope(Dispatchers.Main).launch {
            dsiEMVManager?.collectCardDetails()
        }
    }

    @ReactMethod
    fun setupConfig() {
        Log.d("DsiEMVManagerModule", "setupConfig called")
        CoroutineScope(Dispatchers.Main).launch {
            dsiEMVManager?.checkConfig()
        }
    }

    @ReactMethod
    fun pingConfig() {
        Log.d("DsiEMVManagerModule", "pingConfig called")
        CoroutineScope(Dispatchers.Main).launch {
            dsiEMVManager?.pingConfig()
        }
    }

    @ReactMethod
    fun clearTransactionListener() {
        Log.d("DsiEMVManagerModule", "clearTransactionListener called")
        dsiEMVManager?.clearTransactionListener()
    }

    @ReactMethod
    fun cancelTransaction() {
        Log.d("DsiEMVManagerModule", "cancelTransaction called")
        CoroutineScope(Dispatchers.Main).launch {
            dsiEMVManager?.cancelTransaction()
        }
    }


    // ConfigurationCommunicator callbacks
    override fun onConfigError(errorMessage: String) {
        Log.d("DsiEMVManagerModule", "onConfigError: $errorMessage")
        sendEvent("onConfigError", errorMessage)
    }

    override fun onConfigPingFailed() {
        Log.d("DsiEMVManagerModule", "onConfigPingFailed")
        sendEvent("onConfigPingFailed", null)
    }

    override fun onConfigPingSuccess() {
        Log.d("DsiEMVManagerModule", "onConfigPingSuccess")
        sendEvent("onConfigPingSuccess", null)
    }

    override fun onConfigCompleted() {
        Log.d("DsiEMVManagerModule", "onConfigCompleted")
        sendEvent("onConfigCompleted", null)
    }

    // EMVTransactionCommunicator callbacks
    override fun onError(errorMessage: String) {
        Log.d("DsiEMVManagerModule", "onError: $errorMessage")
        sendEvent("onError", errorMessage)
    }

    override fun onCardReadSuccessfully(cardData: CardData) {
        Log.d("DsiEMVManagerModule", "onCardReadSuccessfully: ${cardData.binNumber}")
        val map = Arguments.createMap().apply {
            putString("binNumber", cardData.binNumber)
        }
        sendEvent("onCardReadSuccessfully", map)
    }

    override fun onSaleTransactionCompleted(saleDetails: SaleTransactionResponse) {
        Log.d("DsiEMVManagerModule", "onSaleTransactionCompleted")
        val map = Arguments.createMap().apply {
            putString("merchantID", saleDetails.merchantID)
            putString("acctNo", saleDetails.acctNo)
            putString("cardType", saleDetails.cardType)
            putString("tranCode", saleDetails.tranCode)
            putString("authCode", saleDetails.authCode)
            putString("captureStatus", saleDetails.captureStatus)
            putString("refNo", saleDetails.refNo)
            putMap("amount", Arguments.createMap().apply {
                putString("purchase", saleDetails.amount.purchase)
                putString("gratuity", saleDetails.amount.gratuity)
                putString("cashBack", saleDetails.amount.cashBack)
                putString("authorize", saleDetails.amount.authorize)
            })
            putString("processData", saleDetails.processData)
            putString("recordNo", saleDetails.recordNo)
            putString("entryMethod", saleDetails.entryMethod)
            putString("date", saleDetails.date)
            putString("time", saleDetails.time)
            putString("applicationLabel", saleDetails.applicationLabel)
            putString("payAPIId", saleDetails.payAPIId)
        }
        sendEvent("onSaleTransactionCompleted", map)
    }

    override fun onShowMessage(message: String) {
        Log.d("DsiEMVManagerModule", "onShowMessage: $message")
        sendEvent("onShowMessage", message)
    }

    private fun sendEvent(eventName: String, params: Any?) {
        Log.d("DsiEMVManagerModule", "sendEvent: $eventName with params: $params")
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
} 