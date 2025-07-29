package com.quivioedge.emvlib.pos

interface EMVBridgeCallback {
    fun onDataReceived(cardBin: CardBin)
    fun onCardFailed(message: String)
    fun onTransactionSuccessFull(message: String)
    fun onTransactionSFailed(message: String)
    fun askToPrintReceipt(printBody: String)
    fun onAlertReceived(message: String)
    fun onWarningReceived(message: String)
}