package com.rohan.emvcardreaderlib.manager

import android.content.Context
import android.util.Log
import com.datacap.android.ProcessTransactionResponseListener
import com.rohan.emvcardreaderlib.CardData
import com.rohan.emvcardreaderlib.ConfigFactory
import com.rohan.emvcardreaderlib.ConfigurationCommunicator
import com.rohan.emvcardreaderlib.CrState
import com.rohan.emvcardreaderlib.EMVTransactionCommunicator
import com.rohan.emvcardreaderlib.ErrorCode
import com.rohan.emvcardreaderlib.POSTransactionExecutor
import com.rohan.emvcardreaderlib.PRINT_TAG
import com.rohan.emvcardreaderlib.XMLResponseExtractor
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class DsiEMVManager(
    val context: Context,
    posConfig: ConfigFactory
) {
    private var currentPosState: CrState = CrState.IDLE
    private var communicator: EMVTransactionCommunicator? = null
    private var configCommunicator: ConfigurationCommunicator? = null

    private val posTransactionExecutor by lazy {
        POSTransactionExecutor(context, posConfig)
    }

      private val posXMLResponseExtractor by lazy {
          XMLResponseExtractor()
    }

    private suspend fun resetPinPad() {
        currentPosState = CrState.Reset
        posTransactionExecutor.resetPinPad()
    }

    suspend fun checkConfig() {
        currentPosState = CrState.RunConfig
        posTransactionExecutor.resetPinPad()
    }

    suspend fun pingConfig() {
        currentPosState = CrState.PingConfig
        posTransactionExecutor.resetPinPad()
    }

    suspend fun collectCardDetails() = withContext(Dispatchers.IO) {
        resetPinPad()
        posTransactionExecutor.collectCardData()
        currentPosState = CrState.PrePaidCardDataCollect
    }

    private suspend fun downloadConfigParams() = withContext(Dispatchers.IO) {
        Log.d(PRINT_TAG, "Download Config Initiated: $currentPosState")
        posTransactionExecutor.downloadConfig()
    }

    suspend fun cancelTransaction(){
        posTransactionExecutor.cancelTransaction()
    }

    suspend fun runSaleTransaction(amount: String) = withContext(Dispatchers.IO) {
        resetPinPad()
        posTransactionExecutor.doSale(amount)
        currentPosState = CrState.EmvSale
    }

    suspend fun runRecurringTransaction(amount: String) = withContext(Dispatchers.IO) {
        resetPinPad()
        posTransactionExecutor.doRecurringSale(amount)
        currentPosState = CrState.SetupRecurringSale
    }

    suspend fun replaceCardInRecurring() = withContext(Dispatchers.IO) {
        resetPinPad()
        posTransactionExecutor.doReplaceCardInRecurring()
        currentPosState = CrState.ReplaceRecurringCard
    }

    fun registerListener(
        communicator: EMVTransactionCommunicator,
        configurationCommunicator: ConfigurationCommunicator? = null
    ) {
        this.communicator = communicator
        this.configCommunicator = configurationCommunicator
        posTransactionExecutor.addPosTransactionListener(processListener)
    }

    fun clearTransactionListener() {
        this.communicator = null
        this.configCommunicator = null
        posTransactionExecutor.clearAllListeners()
    }

    private val processListener = ProcessTransactionResponseListener { res ->
        Log.d(PRINT_TAG, "Process Response: $res")
        CoroutineScope(Dispatchers.IO).launch {
            // First check if a process is already running
            if (posXMLResponseExtractor.isProcessAlreadyRunning(res)) {
                Log.d(PRINT_TAG, "Process already running detected. Auto-cancelling transaction...")
                try {
                    cancelTransaction()
                    Log.d(PRINT_TAG, "Auto-cancel transaction called successfully")
                } catch (e: Exception) {
                    Log.e(PRINT_TAG, "Auto-cancel failed: ${e.message}")
                }
                return@launch // Return early after cancel
            }
            
            // Call isFailed function and store result
            val resStatus = posXMLResponseExtractor.isFailed(res)
            
            // Check if error or success
            if (resStatus) {
                // Error case
                checkErrorResponse(res)
            } else {
                // Success case
                checkSuccessResponse(res)
            }
        }
    }

    private suspend fun checkErrorResponse(xml: String) {
        val error = posXMLResponseExtractor.resolveError(xml)

        error?.let { errorRes ->
            when (currentPosState) {
                CrState.RunConfig -> {
                    if (errorRes.dsixReturnCode == ErrorCode.PSCS_ERROR.code) {
                        downloadConfigParams()
                    } else {
                        configCommunicator?.onConfigError(errorRes.textResponse)
                    }
                }
                CrState.PingConfig -> configCommunicator?.onConfigPingFailed()
                else -> {
                    communicator?.onError(error.textResponse)
                }

            }
        }
        currentPosState = CrState.IDLE
    }

    private fun checkSuccessResponse(xml: String) {
        when (currentPosState) {
            CrState.PingConfig -> {
                configCommunicator?.onConfigPingSuccess()
            }

            CrState.RunConfig -> {
                configCommunicator?.onConfigCompleted()
            }

            CrState.EmvSale -> {
                val response = posXMLResponseExtractor.extractSaleResponse(xml)
                response?.let {
                    communicator?.onSaleTransactionCompleted(it)
                }
            }

            CrState.SetupRecurringSale -> {
                val recurringDetails = posXMLResponseExtractor.extractRecurringTransactionResponse(xml)
                recurringDetails?.let {
                    communicator?.onRecurringSaleCompleted(it)
                }
            }
            CrState.ReplaceRecurringCard -> {
                val recurringDetails = posXMLResponseExtractor.extractZeroAuthResponse(xml)
                recurringDetails?.let {
                    communicator?.onCardReplaceTransactionCompleted(it)
                }
            }
            CrState.PrePaidCardDataCollect -> {
                communicator?.onCardReadSuccessfully(
                    CardData(
                        binNumber = ""
                    )
                )
            }

            else -> Unit
        }
    }

}
