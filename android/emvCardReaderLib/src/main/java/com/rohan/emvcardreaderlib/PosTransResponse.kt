package com.rohan.emvcardreaderlib

sealed class CRTransactionResponse() {
    data class Success(
        val successCode: String,
        val msg: String,
        val printData: String? = null,
        val transactionDetails: SaleTransactionResponse
    ) : CRTransactionResponse()

    data class Error(
        val failureCode: String,
        val msg: String,
        val printData: String? = null
    ) : CRTransactionResponse()
}

sealed class CRPrepaidResponse() {
    data class Success(val cardBin: BIN) : CRPrepaidResponse()
    data class Error(val failureCode: String, val msg: String) : CRPrepaidResponse()
}

enum class TransType {
    EMVParamDownload,
    EMVPadReset,
    EMVSale,
    GetPrePaidStripe
}

data class BIN(
    val value: String
)

enum class ErrorCode(val code: String) {
    PSCS_ERROR("000002")
}

data class SaleTransactionResponse(
    // Basic response fields
    val responseOrigin: String,
    val dsixReturnCode: String,
    val cmdStatus: String,
    val textResponse: String,
    val sequenceNo: String,
    val userTrace: String,
    
    // Transaction details
    val merchantID: String,
    val acctNo: String,
    val cardType: String,
    val tranCode: String,
    val authCode: String,
    val captureStatus: String,
    val refNo: String,
    val invoiceNo: String,
    
    // Amount fields
    val amount: Amount,
    
    // Additional transaction data
    val acqRefData: String,
    val processData: String,
    val recordNo: String,
    val entryMethod: String,
    val date: String,
    val time: String,
    val applicationLabel: String,
    
    // EMV specific fields
    val aid: String,
    val tvr: String,
    val iad: String,
    val tsi: String,
    val arc: String,
    val cvm: String,
    val payAPIId: String
)

data class Amount(
    val purchase: String,
    val gratuity: String,
    val authorize: String,
    val cashback: String
)

data class RecurringTransactionResponse(
    // Basic response fields
    val responseOrigin: String,
    val dsixReturnCode: String,
    val cmdStatus: String,
    val textResponse: String,
    val sequenceNo: String,
    val userTrace: String,
    
    // Transaction details
    val merchantID: String,
    val acctNo: String,
    val cardType: String,
    val tranCode: String,
    val authCode: String,
    val captureStatus: String,
    val refNo: String,
    val invoiceNo: String,
    
    // Amount fields
    val amount: Amount,
    
    // Additional transaction data
    val acqRefData: String,
    val processData: String,
    val cardHolderID: String,
    val recordNo: String,
    val cardholderName: String,
    val recurringData: String,
    val entryMethod: String,
    val date: String,
    val time: String,
    val applicationLabel: String,
    
    // EMV specific fields
    val aid: String,
    val tvr: String,
    val iad: String,
    val tsi: String,
    val arc: String,
    val cvm: String,
    val payAPIId: String
)

data class ErrorResponse(
    // Basic error response fields
    val responseOrigin: String,
    val dsixReturnCode: String,
    val cmdStatus: String,
    val textResponse: String,
    val sequenceNo: String,
    val userTrace: String
)
