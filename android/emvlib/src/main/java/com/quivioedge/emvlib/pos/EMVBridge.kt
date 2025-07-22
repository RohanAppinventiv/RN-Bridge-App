package com.quivioedge.emvlib.pos

import android.content.Context
import android.util.Log
import com.quivioedge.emvlib.pos.models.PAXConfig
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlin.math.log

class EMVBridge private constructor (
    context: Context,
    paxConfig: PAXConfig,
    private val callback: EMVBridgeCallback
): PosCardListener, PosTransactionListener, MessageEvent {


    companion object {
        fun initialise(context: Context, paxConfig: PAXConfig, rnEventCallback: EMVBridgeCallback): EMVBridge{
            return EMVBridge(context, paxConfig, rnEventCallback)
        }
    }
    private val posManager by lazy {
        DsiEMVManager(context, paxConfig)
    }

     fun startEMVSaleTransaction(amount: Double){
         CoroutineScope(Dispatchers.Main).launch {
             posManager.runTransaction()
             listenTransactionResults()
             listenCardResults()
             listenMessageBus()

         }
    }


    suspend fun collectEMVCardData(){
        posManager.collectCardDetails()
    }

    suspend fun printReceipt(template: String){
        posManager.printReceipt(template)
    }
    
    fun listenTransactionResults(){
        posManager.registerTransactionListener(this)
    }

    fun listenCardResults(){
        posManager.registerCardReaderListener(this)
    }

    fun listenMessageBus(){
        posManager.registerMessageBus(this)
    }

    fun clearAllListeners(){
        posManager.clearTransactionListener()
    }

    override fun onDataReceived(cardBin: CardBin) {
        // Return data to RN
    }

    override fun onCardFailed(message: String) {
       // Return Message to RN
    }

    override fun onTransactionSuccessFull(message: String) {
        // Return message to RN
    }

    override fun onTransactionSFailed(message: String) {
        // Return message to RN
    }

    override fun askToPrintReceipt(printBody: String) {
        // Return message to RN to show a prompt
    }

    override fun onAlertReceived(message: String) {
        callback.onAlertReceived(message)
    }

    override fun onWarningReceived(message: String) {

    }
}