# Quivio Transaction Processor

A comprehensive React Native library for EMV payment integration with DataCap terminals. This package provides a robust, TypeScript-first approach to integrating EMV card reader functionality into React Native Android applications.

## 🚀 Features

- **🔌 Easy Integration**: Simple hook-based API for React Native
- **💳 Full EMV Support**: Complete EMV card reading and processing capabilities
- **🤖 Android Native**: Optimized native Android implementation with EMV libraries
- **🔄 Real-time Events**: Comprehensive event system for payment status updates
- **📊 Built-in Logging**: Detailed transaction logging for debugging and monitoring
- **⚡ TypeScript Support**: Full TypeScript definitions and type safety
- **🔄 Recurring Payments**: Support for recurring payment transactions
- **🎯 Multiple Payment Types**: Support for sale, in-house, and recurring transactions
- **🛡️ Error Handling**: Robust error handling and recovery mechanisms

## 📦 Installation

```bash
npm install quivio-transaction-processor
# or
yarn add quivio-transaction-processor
```

## 🔧 Android Setup

This package includes native Android libraries that require proper configuration. Follow these steps carefully:

### 1. Add Native Libraries

First, ensure the `dsiEMVAndroid.aar` file is present in your `android/app/libs/` folder. This file contains the core EMV functionality.

**Important**: Create the `libs` folder if it doesn't exist in your `android/app/` directory.

### 2. Update settings.gradle

Add the following lines to your `android/settings.gradle`:

```gradle
include ':emvCardReaderLib'
project(':emvCardReaderLib').projectDir = file('../node_modules/quivio-transaction-processor/libs/emvCardReaderLib')
include ':emvNative'
project(':emvNative').projectDir = file('../node_modules/quivio-transaction-processor/libs/emvNative')
```

### 3. Update app/build.gradle

Add the following dependencies to your `android/app/build.gradle`:

```gradle
dependencies {
    // ... other dependencies
    implementation files("libs/dsiEMVAndroid.aar")
    implementation project(":emvCardReaderLib")
    implementation project(":emvNative")
}
```

**Critical**: The `implementation files("libs/dsiEMVAndroid.aar")` line is essential for EMV functionality.

### 4. Update MainApplication.kt

Add the import and package registration to your `android/app/src/main/java/com/your-app/MainApplication.kt`:

```kotlin
import com.quivio_transaction_processor.EMVPaymentPackage

class MainApplication : Application(), ReactApplication {
    private val mReactNativeHost = object : ReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> {
            return PackageList(this).packages.apply {
                // Add the EMV payment package
                add(EMVPaymentPackage())
            }
        }
        // ... rest of your MainApplication code
    }
}
```


## 🎯 Quick Start

### Basic Implementation

```tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useEMVPayment } from 'quivio-transaction-processor';

const PaymentScreen = () => {
  const emvConfig = {
    merchantID: "YOUR_MERCHANT_ID",
    onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
    isSandBox: true, // true for testing, false for production
    secureDeviceName: "YOUR_DEVICE_NAME",
    operatorID: "YOUR_OPERATOR_ID",
    posPackageID: "YOUR_POS_PACKAGE_ID" // App Bundle ID
  };

  const {
    isDeviceConnected,
    isInitialized,
    loading,
    handleCardPayment,
    setupConfig,
    logs
  } = useEMVPayment(emvConfig);

  return (
    <View>
      <Text>Status: {isInitialized ? 'Initialized' : 'Not Initialized'}</Text>
      <Text>Device: {isDeviceConnected ? 'Connected' : 'Not Connected'}</Text>
      
      <Button 
        title="Setup Configuration" 
        onPress={setupConfig}
        disabled={loading}
      />
      
      <Button 
        title="Process Payment ($5.00)" 
        onPress={() => handleCardPayment('5.00')}
        disabled={loading || !isDeviceConnected}
      />
      
      {loading && <Text>Processing...</Text>}
    </View>
  );
};
```

### Advanced Implementation with Event Handling

```tsx
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useEMVPayment } from 'quivio-transaction-processor';

const AdvancedPaymentScreen = () => {
  const emvConfig = {
    merchantID: "YOUR_MERCHANT_ID",
    onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
    isSandBox: true,
    secureDeviceName: "YOUR_DEVICE_NAME",
    operatorID: "YOUR_OPERATOR_ID",
    posPackageID: "YOUR_POS_PACKAGE_ID"
  };

  const {
    isDeviceConnected,
    isInitialized,
    loading,
    handleCardPayment,
    handleInHousePayment,
    runRecurringTransaction,
    setupConfig,
    pingConfig,
    clearAllTransactions,
    cancelOperation,
    subscribeToEvent,
    unsubscribeFromEvent,
    EVENTS,
    logs
  } = useEMVPayment(emvConfig);

  useEffect(() => {
    // Subscribe to payment events
    const handleSaleCompleted = (payload) => {
      console.log('Sale completed:', payload);
      // Handle successful sale transaction
    };

    const handleCardRead = (payload) => {
      console.log('Card read successfully:', payload);
      // Handle card read event
    };

    const handleError = (payload) => {
      console.error('Payment error:', payload);
      // Handle error events
    };

    // Subscribe to events
    subscribeToEvent(EVENTS.onSaleTransactionCompleted, handleSaleCompleted);
    subscribeToEvent(EVENTS.onCardReadSuccessfully, handleCardRead);
    subscribeToEvent(EVENTS.onError, handleError);

    // Cleanup on unmount
    return () => {
      unsubscribeFromEvent(EVENTS.onSaleTransactionCompleted, handleSaleCompleted);
      unsubscribeFromEvent(EVENTS.onCardReadSuccessfully, handleCardRead);
      unsubscribeFromEvent(EVENTS.onError, handleError);
    };
  }, []);

  return (
    <View>
      <Text>Status: {isInitialized ? 'Initialized' : 'Not Initialized'}</Text>
      <Text>Device: {isDeviceConnected ? 'Connected' : 'Not Connected'}</Text>
      
      <Button title="Setup Config" onPress={setupConfig} />
      <Button title="Ping Config" onPress={pingConfig} />
      <Button title="EMV Sale" onPress={() => handleCardPayment('5.00')} />
      <Button title="In-House Payment" onPress={handleInHousePayment} />
      <Button title="Recurring Payment" onPress={() => runRecurringTransaction('5.00')} />
      <Button title="Clear Logs" onPress={clearAllTransactions} />
      
      {loading && <Text>Processing...</Text>}
    </View>
  );
};
```

## 📚 API Reference

### useEMVPayment Hook

The main hook that provides all EMV payment functionality.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `EMVConfig` | Yes | EMV configuration object |

#### Configuration Object

```typescript
interface EMVConfig {
  merchantID: string;           // Your merchant ID
  onlineMerchantID: string;     // Your online merchant ID
  isSandBox: boolean;           // true for testing, false for production
  secureDeviceName: string;     // Terminal device name
  operatorID: string;           // Employee/operator ID
  posPackageID: string;         // App Bundle ID
}
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `logs` | `CallbackLog[]` | Array of transaction logs for debugging |
| `isDeviceConnected` | `boolean` | Device connection status |
| `isInitialized` | `boolean` | EMV initialization status |
| `loading` | `boolean` | Loading state for operations |
| `handleCardPayment` | `(amount: string) => void` | Process EMV card payment |
| `handleInHousePayment` | `() => void` | Process in-house payment |
| `runRecurringTransaction` | `(amount: string) => void` | Process recurring payment |
| `setupConfig` | `() => void` | Setup device configuration |
| `pingConfig` | `() => void` | Ping device configuration |
| `clearAllTransactions` | `() => void` | Clear all transaction logs |
| `cancelOperation` | `() => void` | Cancel current operation |
| `initializeEMV` | `() => void` | Manually initialize EMV |
| `subscribeToEvent` | `(eventName, callback) => void` | Subscribe to events |
| `unsubscribeFromEvent` | `(eventName, callback) => void` | Unsubscribe from events |
| `EVENTS` | `Record<EMVEventName, EMVEventName>` | Available event names |

### Available Events

The following events are available for subscription:

| Event | Description | Payload |
|-------|-------------|---------|
| `onError` | Payment or device errors | Error message |
| `onCardReadSuccessfully` | Card successfully read | Card data with BIN |
| `onSaleTransactionCompleted` | Sale transaction completed | Transaction details |
| `onRecurringSaleCompleted` | Recurring sale completed | Recurring transaction details |
| `onShowMessage` | Display messages from device | Message content |
| `onConfigError` | Configuration errors | Error details |
| `onConfigPingFailed` | Configuration ping failed | Failure details |
| `onConfigPingSuccess` | Configuration ping successful | Success details |
| `onConfigCompleted` | Configuration setup completed | Configuration details |

### Transaction Response Types

#### Sale Transaction Response
```typescript
interface SaleTransactionResponse {
  cmdStatus: string;
  textResponse: string;
  sequenceNo: string;
  userTrace: string;
  acctNo: string;
  cardType: string;
  authCode: string;
  captureStatus: string;
  refNo: string;
  invoiceNo: string;
  amount: { purchase: string };
  acqRefData: string;
  entryMethod: string;
  date: string;
  time: string;
}
```

#### Recurring Transaction Response
```typescript
interface RecurringTransactionResponse {
  cmdStatus: string;
  textResponse: string;
  sequenceNo: string;
  userTrace: string;
  captureStatus: string;
  refNo: string;
  invoiceNo: string;
  amount: { purchase: string };
  cardholderName: string;
  acctNo: string;
  cardType: string;
  authCode: string;
  entryMethod: string;
  recordNo: string;
  recurringData: string;
  acqRefData: string;
  date: string;
  time: string;
  payAPIId: string;
}
```

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. Device Not Connecting
**Symptoms**: `isDeviceConnected` remains false
**Solutions**:
- Ensure device is powered on and in pairing mode
- Check Bluetooth permissions in app settings
- Verify device compatibility with your terminal
- Try restarting the device and re-pairing

#### 2. Payment Processing Fails
**Symptoms**: Transactions fail or timeout
**Solutions**:
- Verify device connection status before processing
- Ensure card is properly inserted/swiped
- Check amount format (use "10.00" not "10")
- Verify merchant configuration is correct

#### 3. Events Not Firing
**Symptoms**: No event callbacks received
**Solutions**:
- Ensure proper event subscription
- Check that device is properly configured
- Verify event names match exactly
- Check for JavaScript errors in console

#### 4. Initialization Issues
**Symptoms**: `isInitialized` remains false
**Solutions**:
- Verify all configuration parameters are provided
- Check that `posPackageID` matches your app's bundle ID
- Ensure native modules are properly linked
- Check Android build for compilation errors

### Debug Mode

The hook provides detailed logging through the `logs` array. Display these logs to debug issues:

```tsx
{logs.map((log, index) => (
  <View key={index} style={styles.logItem}>
    <Text style={styles.logType}>{log.type}</Text>
    <Text style={styles.logPayload}>
      {typeof log.payload === 'object' 
        ? JSON.stringify(log.payload, null, 2) 
        : String(log.payload)}
    </Text>
    <Text style={styles.logTime}>
      {new Date(log.timestamp).toLocaleTimeString()}
    </Text>
  </View>
))}
```

### Error Handling Best Practices

1. **Always check device status** before processing payments
2. **Subscribe to error events** to handle failures gracefully
3. **Implement timeout handling** for long-running operations
4. **Provide user feedback** during loading states
5. **Log all transactions** for debugging and audit trails

## 📱 Example Implementation

The package includes a complete example implementation in `src/example/EMVPaymentScreen.tsx`. This example demonstrates:

- Complete UI implementation
- Event handling
- Error management
- Loading states
- Transaction logging
- Multiple payment types

To use the example:

```tsx
import EMVPaymentScreenExample from 'quivio-transaction-processor/example/EMVPaymentScreen';

const myConfig = {
  merchantID: "YOUR_MERCHANT_ID",
  onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
  isSandBox: true,
  secureDeviceName: "YOUR_DEVICE_NAME",
  operatorID: "YOUR_OPERATOR_ID",
  posPackageID: "YOUR_POS_PACKAGE_ID"
};

// Use in your app with your configuration
<EMVPaymentScreenExample config={myConfig} />
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/RohanAppinventiv/RN-Bridge-App.git

# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 **Email**: Contact the maintainers
- 🐛 **Issues**: Open an issue on [GitHub](https://github.com/RohanAppinventiv/RN-Bridge-App)
- 📖 **Documentation**: Check the example implementation


