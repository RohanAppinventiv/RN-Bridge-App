package com.rn_bridge_demo

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.rohan.emvcardreaderlib.manager.DsiEMVManager
import com.rohan.emvcardreaderlib.EMVTransactionCommunicator
import com.rohan.emvcardreaderlib.ConfigurationCommunicator
import com.rohan.emvcardreaderlib.CardData
import com.rohan.emvcardreaderlib.SaleTransactionResponse
import com.rohan.emvcardreaderlib.RecurringTransactionResponse
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

    @ReactMethod
    fun runRecurringTransaction(amount: String) {
        Log.d("DsiEMVManagerModule", "runRecurringTransaction called with amount: $amount")
        CoroutineScope(Dispatchers.Main).launch {
            dsiEMVManager?.runRecurringTransaction(amount)
        }
    }

    // ConfigurationCommunicator callbacks
    override fun onConfigError(errorMessage: String) {
        Log.d("DsiEMVManagerModule", "onConfigError: $errorMessage")
        sendEvent("onConfigError", errorMessage)
    }

    override fun onConfigPingFailed() {
        Log.d("DsiEMVManagerModule", "onConfigPingFailed")
        val failedMap = Arguments.createMap().apply {
            putString("status", "failed")
            putString("message", "Configuration ping failed")
            putString("timestamp", System.currentTimeMillis().toString())
        }
        sendEvent("onConfigPingFailed", failedMap)
    }

    override fun onConfigPingSuccess() {
        Log.d("DsiEMVManagerModule", "onConfigPingSuccess")
        val successMap = Arguments.createMap().apply {
            putString("status", "success")
            putString("message", "Configuration ping successful")
            putString("timestamp", System.currentTimeMillis().toString())
        }
        sendEvent("onConfigPingSuccess", successMap)
    }

    override fun onConfigCompleted() {
        Log.d("DsiEMVManagerModule", "onConfigCompleted")
        val completedMap = Arguments.createMap().apply {
            putString("status", "completed")
            putString("message", "Configuration setup completed")
            putString("timestamp", System.currentTimeMillis().toString())
        }
        sendEvent("onConfigCompleted", completedMap)
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
            // Basic response fields
            putString("responseOrigin", saleDetails.responseOrigin)
            putString("dsixReturnCode", saleDetails.dsixReturnCode)
            putString("cmdStatus", saleDetails.cmdStatus)
            putString("textResponse", saleDetails.textResponse)
            putString("sequenceNo", saleDetails.sequenceNo)
            putString("userTrace", saleDetails.userTrace)
            
            // Transaction details
            putString("merchantID", saleDetails.merchantID)
            putString("acctNo", saleDetails.acctNo)
            putString("cardType", saleDetails.cardType)
            putString("tranCode", saleDetails.tranCode)
            putString("authCode", saleDetails.authCode)
            putString("captureStatus", saleDetails.captureStatus)
            putString("refNo", saleDetails.refNo)
            putString("invoiceNo", saleDetails.invoiceNo)
            
            // Amount fields
            putMap("amount", Arguments.createMap().apply {
                putString("purchase", saleDetails.amount.purchase)
                putString("gratuity", saleDetails.amount.gratuity)
                putString("authorize", saleDetails.amount.authorize)
                putString("cashback", saleDetails.amount.cashback)
            })

            // Additional transaction data
            putString("acqRefData", saleDetails.acqRefData)
            putString("processData", saleDetails.processData)
            putString("recordNo", saleDetails.recordNo)
            putString("entryMethod", saleDetails.entryMethod)
            putString("date", saleDetails.date)
            putString("time", saleDetails.time)
            putString("applicationLabel", saleDetails.applicationLabel)
            
            // EMV specific fields
            putString("aid", saleDetails.aid)
            putString("tvr", saleDetails.tvr)
            putString("iad", saleDetails.iad)
            putString("tsi", saleDetails.tsi)
            putString("arc", saleDetails.arc)
            putString("cvm", saleDetails.cvm)
            putString("payAPIId", saleDetails.payAPIId)
        }
        sendEvent("onSaleTransactionCompleted", map)
    }

    override fun onRecurringSaleCompleted(recurringDetails: RecurringTransactionResponse) {
        Log.d("DsiEMVManagerModule", "onRecurringSaleCompleted")
        val map = Arguments.createMap().apply {
            // Basic response fields
            putString("responseOrigin", recurringDetails.responseOrigin)
            putString("dsixReturnCode", recurringDetails.dsixReturnCode)
            putString("cmdStatus", recurringDetails.cmdStatus)
            putString("textResponse", recurringDetails.textResponse)
            putString("sequenceNo", recurringDetails.sequenceNo)
            putString("userTrace", recurringDetails.userTrace)
            
            // Transaction details
            putString("merchantID", recurringDetails.merchantID)
            putString("acctNo", recurringDetails.acctNo)
            putString("cardType", recurringDetails.cardType)
            putString("tranCode", recurringDetails.tranCode)
            putString("authCode", recurringDetails.authCode)
            putString("captureStatus", recurringDetails.captureStatus)
            putString("refNo", recurringDetails.refNo)
            putString("invoiceNo", recurringDetails.invoiceNo)
            
            // Amount fields
            putMap("amount", Arguments.createMap().apply {
                putString("purchase", recurringDetails.amount.purchase)
                putString("gratuity", recurringDetails.amount.gratuity)
                putString("authorize", recurringDetails.amount.authorize)
                putString("cashback", recurringDetails.amount.cashback)
            })
            
            // Additional transaction data
            putString("acqRefData", recurringDetails.acqRefData)
            putString("processData", recurringDetails.processData)
            putString("cardHolderID", recurringDetails.cardHolderID)
            putString("recordNo", recurringDetails.recordNo)
            putString("cardholderName", recurringDetails.cardholderName)
            putString("recurringData", recurringDetails.recurringData)
            putString("entryMethod", recurringDetails.entryMethod)
            putString("date", recurringDetails.date)
            putString("time", recurringDetails.time)
            putString("applicationLabel", recurringDetails.applicationLabel)
            
            // EMV specific fields
            putString("aid", recurringDetails.aid)
            putString("tvr", recurringDetails.tvr)
            putString("iad", recurringDetails.iad)
            putString("tsi", recurringDetails.tsi)
            putString("arc", recurringDetails.arc)
            putString("cvm", recurringDetails.cvm)
            putString("payAPIId", recurringDetails.payAPIId)
        }
        sendEvent("onRecurringSaleCompleted", map)
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