package com.rohan.emvcardreaderlib

import android.util.Log

class XMLResponseExtractor {

    companion object {
        private const val TAG = "XMLResponseExtractor"
    }

    /**
     * Returns the inner text of the first occurrence of <tagName> … </tagName>
     * or null if the tag isn't present.
     */
    private fun getTag(xml: String, tagName: String): String? {
        // (?s) ⇒ dot matches newline
        val regex = Regex("(?s)<$tagName>(.*?)</$tagName>", RegexOption.IGNORE_CASE)
        return regex.find(xml)?.groupValues?.get(1)
    }

    /**
     * Extracts all sale response fields from XML
     * Returns a SaleTransactionResponse object containing all extracted fields
     */
    fun extractSaleResponse(xml: String): SaleTransactionResponse? = try {
        // helper to fetch a tag or default to ""
        val tag: (String) -> String = { name -> getTag(xml, name) ?: "" }

        // build the amount object
        val amount = Amount(
            purchase  = tag("Purchase").ifEmpty { "0.00" },
            gratuity  = tag("Gratuity").ifEmpty { "0.00" },
            authorize = tag("Authorize").ifEmpty { "0.00" },
            cashback  = tag("Cashback").ifEmpty { "0.00" }
        )

        // construct the response in one go
        SaleTransactionResponse(
            // Basic response fields
            responseOrigin   = tag("ResponseOrigin"),
            dsixReturnCode  = tag("DSIXReturnCode"),
            cmdStatus       = tag("CmdStatus"),
            textResponse    = tag("TextResponse"),
            sequenceNo      = tag("SequenceNo"),
            userTrace       = tag("UserTrace"),

            // Transaction details
            merchantID      = tag("MerchantID"),
            acctNo          = tag("AcctNo"),
            cardType        = tag("CardType"),
            tranCode        = tag("TranCode"),
            authCode        = tag("AuthCode"),
            captureStatus   = tag("CaptureStatus"),
            refNo           = tag("RefNo"),
            invoiceNo       = tag("InvoiceNo"),

            // Amount fields
            amount          = amount,

            // Additional transaction data
            acqRefData      = tag("AcqRefData"),
            processData     = tag("ProcessData"),
            recordNo        = tag("RecordNo"),
            entryMethod     = tag("EntryMethod"),
            date            = tag("Date"),
            time            = tag("Time"),
            applicationLabel= tag("ApplicationLabel"),

            // EMV specific fields
            aid             = tag("AID"),
            tvr             = tag("TVR"),
            iad             = tag("IAD"),
            tsi             = tag("TSI"),
            arc             = tag("ARC"),
            cvm             = tag("CVM"),
            payAPIId        = tag("PayAPI_Id")
        ).also {
            Log.d(TAG, "Successfully extracted SaleTransactionResponse from XML")
        }
    } catch (e: Exception) {
        Log.e(TAG, "Error extracting sale response: ${e.message}")
        // fall back to an "empty" response
        null
    }

    /**
     * Extracts comprehensive response fields from XML including all specified tags
     * Returns a ComprehensiveTransactionResponse object containing all extracted fields
     */
    fun extractRecurringTransactionResponse(xml: String): RecurringTransactionResponse? = try {
        // helper to fetch a tag or default to ""
        val tag: (String) -> String = { name -> getTag(xml, name) ?: "" }

        val amount = Amount(
            purchase  = tag("Purchase").ifEmpty { "0.00" },
            gratuity  = tag("Gratuity").ifEmpty { "0.00" },
            authorize = tag("Authorize").ifEmpty { "0.00" },
            cashback  = tag("Cashback").ifEmpty { "0.00" }
        )
        // construct the comprehensive response
        RecurringTransactionResponse(
            // Basic response fields
            responseOrigin   = tag("ResponseOrigin"),
            dsixReturnCode  = tag("DSIXReturnCode"),
            cmdStatus       = tag("CmdStatus"),
            textResponse    = tag("TextResponse"),
            sequenceNo      = tag("SequenceNo"),
            userTrace       = tag("UserTrace"),

            // Transaction details
            merchantID      = tag("MerchantID"),
            acctNo          = tag("AcctNo"),
            cardType        = tag("CardType"),
            tranCode        = tag("TranCode"),
            authCode        = tag("AuthCode"),
            captureStatus   = tag("CaptureStatus"),
            refNo           = tag("RefNo"),
            invoiceNo       = tag("InvoiceNo"),

            // Amount fields
            amount         = amount,

            // Additional transaction data
            acqRefData      = tag("AcqRefData"),
            processData     = tag("ProcessData"),
            cardHolderID    = tag("CardHolderID"),
            recordNo        = tag("RecordNo"),
            cardholderName  = tag("CardholderName"),
            recurringData   = tag("RecurringData"),
            entryMethod     = tag("EntryMethod"),
            date            = tag("Date"),
            time            = tag("Time"),
            applicationLabel= tag("ApplicationLabel"),

            // EMV specific fields
            aid             = tag("AID"),
            tvr             = tag("TVR"),
            iad             = tag("IAD"),
            tsi             = tag("TSI"),
            arc             = tag("ARC"),
            cvm             = tag("CVM"),
            payAPIId        = tag("PayAPI_Id")
        ).also {
            Log.d(TAG, "Successfully extracted ComprehensiveTransactionResponse from XML")
        }
    } catch (e: Exception) {
        Log.e(TAG, "Error extracting comprehensive response: ${e.message}")
        // fall back to an "empty" response
        null
    }

    /**
     * Extracts ZeroAuth response fields from XML including all specified tags
     * Returns a ZeroAuth object containing all extracted fields
     */
    fun extractZeroAuthResponse(xml: String): ZeroAuthTransactionResponse? = try {
        // helper to fetch a tag or default to ""
        val tag: (String) -> String = { name -> getTag(xml, name) ?: "" }

        val amount = Amount(
            purchase  = tag("Purchase").ifEmpty { "0.00" },
            gratuity  = tag("Gratuity").ifEmpty { "0.00" },
            authorize = tag("Authorize").ifEmpty { "0.00" },
            cashback  = tag("Cashback").ifEmpty { "0.00" }
        )
        // construct the comprehensive response
        ZeroAuthTransactionResponse(
            // Basic response fields
            responseOrigin   = tag("ResponseOrigin"),
            dsixReturnCode  = tag("DSIXReturnCode"),
            cmdStatus       = tag("CmdStatus"),
            textResponse    = tag("TextResponse"),
            sequenceNo      = tag("SequenceNo"),
            userTrace       = tag("UserTrace"),

            // Transaction details
            merchantID      = tag("MerchantID"),
            acctNo          = tag("AcctNo"),
            cardType        = tag("CardType"),
            tranCode        = tag("TranCode"),
            authCode        = tag("AuthCode"),
            refNo           = tag("RefNo"),
            invoiceNo       = tag("InvoiceNo"),

            // Amount fields
            amount         = amount,

            // Additional transaction data
            acqRefData      = tag("AcqRefData"),
            processData     = tag("ProcessData"),
            cardHolderID    = tag("CardHolderID"),
            recordNo        = tag("RecordNo"),
            cardholderName  = tag("CardholderName"),
            entryMethod     = tag("EntryMethod"),
            date            = tag("Date"),
            time            = tag("Time"),
            applicationLabel= tag("ApplicationLabel"),

            // EMV specific fields
            aid             = tag("AID"),
            tvr             = tag("TVR"),
            iad             = tag("IAD"),
            tsi             = tag("TSI"),
            arc             = tag("ARC"),
            cvm             = tag("CVM"),
            payAPIId        = tag("PayAPI_Id")
        ).also {
            Log.d(TAG, "Successfully extracted ComprehensiveTransactionResponse from XML")
        }
    } catch (e: Exception) {
        Log.e(TAG, "Error extracting comprehensive response: ${e.message}")
        // fall back to an "empty" response
        null
    }

    /**
     * Checks if the response indicates a process is already running
     * Returns true if ResponseOrigin is "Client" and DSIXReturnCode is "003002"
     */
    fun isProcessAlreadyRunning(xml: String): Boolean {
        return getTag(xml, "ResponseOrigin") == "Client" &&
                getTag(xml, "DSIXReturnCode") == "003002"
    }

    /**
     * Checks if the response indicates a failure
     * Returns true if CmdStatus is "Error"
     */
    fun isFailed(xml: String): Boolean {
        return getTag(xml, "CmdStatus") == "Error"
    }

    /**
     * Extracts error response fields from XML
     * Returns an ErrorResponse object containing all extracted error fields
     */
    fun resolveError(response: String): ErrorResponse? = try {
        // helper to fetch a tag or default to ""
        val tag: (String) -> String = { name -> getTag(response, name) ?: "" }

        // construct the error response
        ErrorResponse(
            responseOrigin   = tag("ResponseOrigin"),
            dsixReturnCode  = tag("DSIXReturnCode"),
            cmdStatus       = tag("CmdStatus"),
            textResponse    = tag("TextResponse"),
            sequenceNo      = tag("SequenceNo"),
            userTrace       = tag("UserTrace")
        ).also {
            Log.d(TAG, "Extracted ErrorResponse from XML")
        }
    } catch (e: Exception) {
        Log.e(TAG, "Error extracting error response: ${e.message}")
        // fall back to null
        null
    }

} 