package com.rohan.emvcardreaderlib.builder

import com.rohan.emvcardreaderlib.ConfigFactory
import com.rohan.emvcardreaderlib.TransType

class DsiEMVRequestBuilder(val config: ConfigFactory) {

    private val merchantID = config.merchantID
    private val onlineMerchantID = config.onlineMerchantID
    private val operationMode = if (config.isSandBox) "CERT" else "PROD"
    private val comPort = 1
    private val secureDevice = config.secureDeviceName
    private val posPackageID = config.posPackageID

    private val userTrace = config.operatorID

    private var sequenceNo = "0010010010"

    private fun createUniqueInvoiceNo() = "${userTrace}-${System.currentTimeMillis()}"

    fun buildPinPadResetRequest(): String {
        return """
            <?xml version="1.0"?>
            <TStream>
            <Transaction>
            <ComPort>${comPort}</ComPort>
            <OperationMode>${operationMode}</OperationMode>    
            <UseForms>Suppressed</UseForms> 
            <MerchantID>${merchantID}</MerchantID>
            <POSPackageID>${posPackageID}</POSPackageID>
            <SecureDevice>${secureDevice}</SecureDevice>
            <SequenceNo>${sequenceNo}</SequenceNo>
            <TranCode>${TransType.EMVPadReset.name}</TranCode>
            </Transaction>
            </TStream>
    """.trimIndent()
    }

    fun buildCollectCardDataRequest(): String {
        return """<?xml version="1.0" ?>
              <TStream>
                <Transaction>
                <ComPort>${comPort}</ComPort>
                <SecureDevice>${secureDevice}</SecureDevice>
                <SequenceNo>${sequenceNo}</SequenceNo>
                <UserTrace>${userTrace}</UserTrace>
                <MerchantID>${merchantID}</MerchantID>
                <TranCode>${TransType.GetPrePaidStripe.name}</TranCode>
                <Account>
                <AcctNo>SecureDevice</AcctNo>
                </Account>
                <MinLen>0</MinLen>
                <MaxLen>19</MaxLen>
                </Transaction>
            </TStream>
        """.trimIndent()
    }

    fun buildEMVSaleRequest(amount: String): String {
        return """<?xml version="1.0"?>
        <TStream>
        <Transaction>
        <ComPort>${comPort}</ComPort>
        <SequenceNo>${sequenceNo}</SequenceNo>
        <UserTrace>${userTrace}</UserTrace>
        <POSPackageID>${posPackageID}</POSPackageID>
        <OperationMode>${operationMode}</OperationMode>    
        <MerchantID>${merchantID}</MerchantID>
        <SecureDevice>${secureDevice}</SecureDevice>
        <TranCode>${TransType.EMVSale.name}</TranCode>
        <Amount>
            <Purchase>${amount}</Purchase>
        </Amount>
        <InvoiceNo>${createUniqueInvoiceNo()}</InvoiceNo>
        <RefNo>${createUniqueInvoiceNo()}</RefNo>
        <Frequency>Recurring</Frequency>
        <RecordNo>RecordNumberRequested</RecordNo>
        </Transaction>
        </TStream>""".trimIndent()
    }
    fun buildEMVRecurringSaleRequest(amount: String): String {
        return """<?xml version="1.0"?>
        <TStream>
        <Transaction>
            <ComPort>${comPort}</ComPort>
            <MerchantID>${merchantID}</MerchantID>
            <OperationMode>${operationMode}</OperationMode>
            <POSPackageID>${posPackageID}</POSPackageID>
            <UserTrace>${userTrace}</UserTrace>
            <CardType>Credit</CardType>
            <TranCode>${TransType.EMVSale.name}</TranCode>
            <ProcessorToken>TokenRequested</ProcessorToken>
            <CollectData>CardholderName</CollectData>
            <SecureDevice>${secureDevice}</SecureDevice>
            <InvoiceNo>${createUniqueInvoiceNo()}</InvoiceNo>
            <RefNo>${createUniqueInvoiceNo()}</RefNo>
            <Amount>
                <Purchase>${amount}</Purchase>
            </Amount>
            <SequenceNo>${sequenceNo}</SequenceNo>
            <Frequency>Recurring</Frequency>
            <RecurringData>Recurring</RecurringData>
            <RecordNo>RecordNumberRequested</RecordNo>
            <CardHolderID>Allow_V2</CardHolderID>
        </Transaction>
        </TStream>""".trimIndent()
    }

    fun buildEMVParamDownloadRequest(): String {
        return """
        <?xml version="1.0"?>
        <TStream>
        <Admin>
        <ComPort>${comPort}</ComPort>
        <OperationMode>${operationMode}</OperationMode>    
        <TranCode>${TransType.EMVParamDownload.name}</TranCode>
        <MerchantID>${merchantID}</MerchantID>
        <SequenceNo>${sequenceNo}</SequenceNo>
        <POSPackageID>${posPackageID}</POSPackageID>
        <SecureDevice>${secureDevice}</SecureDevice>
        </Admin>
        </TStream>
    """.trimIndent()
    }

    fun buildReplaceCardInRecurringRequest(): String {
        return """<?xml version="1.0"?>
        <TStream>
        <Transaction>
            <ComPort>${comPort}</ComPort>
            <OperationMode>${operationMode}</OperationMode>
            <MerchantID>${merchantID}</MerchantID>
            <POSPackageID>${posPackageID}</POSPackageID>
            <UserTrace>${userTrace}</UserTrace>
            <TranCode>${TransType.EMVZeroAuth.name}</TranCode>
            <ProcessorToken>TokenRequested</ProcessorToken>
            <SecureDevice>${secureDevice}</SecureDevice>
            <InvoiceNo>${createUniqueInvoiceNo()}</InvoiceNo>
            <RefNo>${createUniqueInvoiceNo()}</RefNo>
            <Amount>
                <Purchase>0.00</Purchase>
            </Amount>
            <SequenceNo>${sequenceNo}</SequenceNo>
            <CollectData>CardholderName</CollectData>
            <RecordNo>RecordNumberRequested</RecordNo>
            <Frequency>Frequency</Frequency>
            <CardHolderID>Allow_V2</CardHolderID>
        </Transaction>
        </TStream>""".trimIndent()
    }
}