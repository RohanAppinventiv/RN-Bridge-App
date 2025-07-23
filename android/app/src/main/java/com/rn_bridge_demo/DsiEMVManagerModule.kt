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

    override fun initialize() {
        val context = currentActivity ?: reactContext
        dsiEMVManager = DsiEMVManager(context)
        dsiEMVManager?.registerListener(this, this)
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
        CoroutineScope(Dispatchers.Main).launch {
            dsiEMVManager?.checkConfig()
        }
    }

    @ReactMethod
    fun pingConfig() {
        CoroutineScope(Dispatchers.Main).launch {
            dsiEMVManager?.pingConfig()
        }
    }

    @ReactMethod
    fun clearTransactionListener() {
        dsiEMVManager?.clearTransactionListener()
    }

    // EMVTransactionCommunicator callbacks
    override fun onError(errorMessage: String) {
        sendEvent("onError", errorMessage)
    }

    override fun onCardReadSuccessfully(cardData: CardData) {
        val map = Arguments.createMap().apply {
            putString("binNumber", cardData.binNumber)
        }
        sendEvent("onCardReadSuccessfully", map)
    }

    override fun onSaleTransactionCompleted(saleDetails: SaleTransactionResponse) {
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
        sendEvent("onShowMessage", message)
    }

    // ConfigurationCommunicator callbacks
    override fun onConfigError(errorMessage: String) {
        sendEvent("onConfigError", errorMessage)
    }

    override fun onConfigPingFailed() {
        sendEvent("onConfigPingFailed", null)
    }

    override fun onConfigPingSuccess() {
        sendEvent("onConfigPingSuccess", null)
    }

    override fun onConfigCompleted() {
        sendEvent("onConfigCompleted", null)
    }

    private fun sendEvent(eventName: String, params: Any?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
} 