package com.rn_bridge_demo

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.quivioedge.emvlib.pos.EMVBridge
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import android.util.Log

class EMVPaymentModule(val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "EMVPayment"
    }


    override fun getName() = NAME

    @ReactMethod
    fun startEMVTransaction(amount: Double, promise: Promise) {
        Log.d("EMVPaymentModule", "startEMVTransaction called with amount: $amount")
        val activity = currentActivity ?: run {
            Log.e("EMVPaymentModule", "No current activity")
            promise.reject("NO_ACTIVITY", "No current activity")
            return
        }
        try {
            Log.d("EMVPaymentModule", "About to call emvManager?.runTransaction()")
            val trans = EMVBridge(activity).startEMVTransaction()
            Log.d("EMVPaymentModule", "Transaction started successfully: $trans")
            promise.resolve("Transaction started")
        } catch (e: Exception) {
            Log.e("EMVPaymentModule", "Transaction error", e)
            promise.reject("TRANSACTION_ERROR", e)
        }
    }

    @ReactMethod
    fun getCardDetails(promise: Promise) {
        Log.d("EMVPaymentModule", "getCardDetails called")
        val activity = currentActivity ?: run {
            Log.e("EMVPaymentModule", "No current activity")
            promise.reject("NO_ACTIVITY", "No current activity")
            return
        }
        CoroutineScope(Dispatchers.Main).launch {
            try {
                Log.d("EMVPaymentModule", "About to call emvManager?.collectCardDetails()")
                EMVBridge(activity).collectEMVCardData()
                Log.d("EMVPaymentModule", "Card details collected successfully")
                promise.resolve("Card details collected")
            } catch (e: Exception) {
                Log.e("EMVPaymentModule", "Card details error", e)
                promise.reject("CARD_ERROR", e)
            }
        }
    }

    @ReactMethod
    fun cancelTransaction(promise: Promise) {
        Log.d("EMVPaymentModule", "cancelTransaction called")
        promise.resolve(true)
    }

    @ReactMethod
    fun printReceipt(str: String, promise: Promise) {
        Log.d("EMVPaymentModule", "printReceipt called with str: $str")
        val activity = currentActivity ?: run {
            Log.e("EMVPaymentModule", "No current activity")
            promise.reject("NO_ACTIVITY", "No current activity")
            return
        }
        CoroutineScope(Dispatchers.Main).launch {
            try {
                Log.d("EMVPaymentModule", "About to call emvManager?.printReceipt()")
                EMVBridge(activity).printReceipt(str)
                Log.d("EMVPaymentModule", "Print Job Initiated")
                promise.resolve("Printing Done!")
            } catch (e: Exception) {
                Log.e("EMVPaymentModule", "Printing Job error", e)
                promise.reject("PRINTING_ERROR", e)
            }
        }
        promise.resolve(true)
    }
}