# Quivio Transaction Processor

A comprehensive React Native library for EMV payment integration with DataCap terminals. This package provides a robust, TypeScript-first approach to integrating EMV card reader functionality into React Native Android applications.

## 🚀 Features

- **🔌 Easy Integration**: Simple provider-based API for React Native
- **💳 Full EMV Support**: Complete EMV card reading and processing capabilities
- **🤖 Android Native**: Optimized native Android implementation with EMV libraries
- **🔄 Real-time Events**: Comprehensive event system for payment status updates
- **📊 Built-in Logging**: Detailed transaction logging for debugging and monitoring
- **⚡ TypeScript Support**: Full TypeScript definitions and type safety
- **🔄 Recurring Payments**: Support for recurring payment transactions
- **🎯 Multiple Payment Types**: Support for sale, in-house, recurring, and card replacement transactions
- **🛡️ Error Handling**: Robust error handling and recovery mechanisms
- **🎯 Context-Based State Management**: Centralized state management with React Context

## 📦 Installation

```bash
npm install quivio-transaction-processor
# or
yarn add quivio-transaction-processor
```

## 🏗️ Architecture Overview

### Context-Based State Management
The package uses React Context for state management, providing:
- **Centralized State**: All payment state managed in one place
- **Automatic Initialization**: EMV manager initialized on provider mount
- **Event Management**: Built-in event subscription and cleanup
- **Type Safety**: Full TypeScript support with proper typing

### Provider Pattern
```tsx
// Wrap your app or component with PaymentProvider
<PaymentProvider config={emvConfig}>
  <YourPaymentComponent />
</PaymentProvider>

// Use the hook in any child component
const { handleCardPayment, isDeviceConnected } = useEMVPayment();
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

### Basic Implementation with PaymentProvider

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { PaymentProvider, useEMVPayment, EMVConfig } from 'quivio-transaction-processor';

const emvConfig: EMVConfig = {
  merchantID: "YOUR_MERCHANT_ID",
  onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
  isSandBox: true, // true for testing, false for production
  secureDeviceName: "YOUR_DEVICE_NAME",
  operatorID: "YOUR_OPERATOR_ID",
  posPackageID: "com.your_app:1.0" // App Bundle ID and version
};

const PaymentScreen = () => {
  return (
    <PaymentProvider config={emvConfig}>
      <PaymentContent />
    </PaymentProvider>
  );
};

const PaymentContent = () => {
  const {
    logs,
    isDeviceConnected,
    loading,
    isInitialized,
    handleCardPayment,
    setupConfig,
    EVENTS
  } = useEMVPayment();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Status: {isInitialized ? '✅ Initialized' : '❌ Not Initialized'}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        Device: {isDeviceConnected ? '✅ Connected' : '❌ Not Connected'}
      </Text>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: isDeviceConnected ? '#4CAF50' : '#FF9800', 
          padding: 12, 
          borderRadius: 8,
          marginBottom: 10
        }}
        onPress={setupConfig}
        disabled={loading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isDeviceConnected ? 'Configuration Ready' : 'Setup Configuration'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: (loading || !isDeviceConnected) ? '#ccc' : '#2196F3', 
          padding: 12, 
          borderRadius: 8,
          marginBottom: 10
        }}
        onPress={() => handleCardPayment('5.00')}
        disabled={loading || !isDeviceConnected}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Process Payment ($5.00)
        </Text>
      </TouchableOpacity>
      
      {loading && (
        <Text style={{ textAlign: 'center', color: '#FF9800', marginBottom: 10 }}>
          Processing...
        </Text>
      )}
      
      <ScrollView style={{ flex: 1 }}>
        {logs.map((log, index) => (
          <View key={index} style={{ 
            backgroundColor: '#f5f5f5', 
            padding: 8, 
            marginBottom: 5, 
            borderRadius: 4 
          }}>
            <Text style={{ fontWeight: 'bold' }}>{log.type}</Text>
            <Text>{JSON.stringify(log.payload, null, 2)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
```

### Advanced Implementation with Event Handling

```tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { PaymentProvider, useEMVPayment, EMVConfig } from 'quivio-transaction-processor';

const emvConfig: EMVConfig = {
  merchantID: "YOUR_MERCHANT_ID",
  onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
  isSandBox: true,
  secureDeviceName: "YOUR_DEVICE_NAME",
  operatorID: "YOUR_OPERATOR_ID",
  posPackageID: "com.your_app:1.0"
};

const AdvancedPaymentScreen = () => {
  return (
    <PaymentProvider config={emvConfig}>
      <AdvancedPaymentContent />
    </PaymentProvider>
  );
};

const AdvancedPaymentContent = () => {
  const {
    logs,
    isDeviceConnected,
    loading,
    isInitialized,
    handleCardPayment,
    handleInHousePayment,
    runRecurringTransaction,
    replaceCardInRecurring,
    setupConfig,
    pingConfig,
    clearAllTransactions,
    cancelOperation,
    subscribeToEvent,
    unsubscribeFromEvent,
    EVENTS
  } = useEMVPayment();

  useEffect(() => {
    // Subscribe to payment events
    const saleListener = subscribeToEvent(EVENTS.onSaleTransactionCompleted, (payload) => {
      console.log('Sale completed:', payload);
      // Handle successful sale transaction
    });

    const cardReadListener = subscribeToEvent(EVENTS.onCardReadSuccessfully, (payload) => {
      console.log('Card read successfully:', payload);
      // Handle card read event
    });

    const errorListener = subscribeToEvent(EVENTS.onError, (payload) => {
      console.error('Payment error:', payload);
      // Handle error events
    });

    const configSuccessListener = subscribeToEvent(EVENTS.onConfigCompleted, (payload) => {
      console.log('Configuration completed:', payload);
      // Handle successful configuration
    });

    const deviceConnectedListener = subscribeToEvent(EVENTS.onConfigPingSuccess, (payload) => {
      console.log('Device connected:', payload);
      // Handle device connection success
    });

    // Cleanup on unmount
    return () => {
      if (saleListener) unsubscribeFromEvent(EVENTS.onSaleTransactionCompleted, saleListener.listener);
      if (cardReadListener) unsubscribeFromEvent(EVENTS.onCardReadSuccessfully, cardReadListener.listener);
      if (errorListener) unsubscribeFromEvent(EVENTS.onError, errorListener.listener);
      if (configSuccessListener) unsubscribeFromEvent(EVENTS.onConfigCompleted, configSuccessListener.listener);
      if (deviceConnectedListener) unsubscribeFromEvent(EVENTS.onConfigPingSuccess, deviceConnectedListener.listener);
    };
  }, [subscribeToEvent, unsubscribeFromEvent, EVENTS]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Status: {isInitialized ? '✅ Initialized' : '❌ Not Initialized'}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        Device: {isDeviceConnected ? '✅ Connected' : '❌ Not Connected'}
      </Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#4CAF50', 
            padding: 10, 
            borderRadius: 8,
            flex: 1,
            minWidth: 120
          }}
          onPress={setupConfig}
          disabled={loading}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Setup Config
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#2196F3', 
            padding: 10, 
            borderRadius: 8,
            flex: 1,
            minWidth: 120
          }}
          onPress={pingConfig}
          disabled={loading}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Ping Config
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: (loading || !isDeviceConnected) ? '#ccc' : '#9C27B0', 
            padding: 10, 
            borderRadius: 8,
            flex: 1,
            minWidth: 120
          }}
          onPress={() => handleCardPayment('5.00')}
          disabled={loading || !isDeviceConnected}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            EMV Sale
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: (loading || !isDeviceConnected) ? '#ccc' : '#FF5722', 
            padding: 10, 
            borderRadius: 8,
            flex: 1,
            minWidth: 120
          }}
          onPress={handleInHousePayment}
          disabled={loading || !isDeviceConnected}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            In-House
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: (loading || !isDeviceConnected) ? '#ccc' : '#607D8B', 
            padding: 10, 
            borderRadius: 8,
            flex: 1,
            minWidth: 120
          }}
          onPress={() => runRecurringTransaction('5.00')}
          disabled={loading || !isDeviceConnected}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Recurring
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: (loading || !isDeviceConnected) ? '#ccc' : '#795548', 
            padding: 10, 
            borderRadius: 8,
            flex: 1,
            minWidth: 120
          }}
          onPress={replaceCardInRecurring}
          disabled={loading || !isDeviceConnected}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
            Replace Card
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#F44336', 
          padding: 10, 
          borderRadius: 8,
          marginBottom: 10
        }}
        onPress={clearAllTransactions}
        disabled={loading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Clear Logs
        </Text>
      </TouchableOpacity>
      
      {loading && (
        <Text style={{ textAlign: 'center', color: '#FF9800', marginBottom: 10 }}>
          Processing...
        </Text>
      )}
      
      <ScrollView style={{ flex: 1 }}>
        {logs.map((log, index) => (
          <View key={index} style={{ 
            backgroundColor: '#f5f5f5', 
            padding: 8, 
            marginBottom: 5, 
            borderRadius: 4 
          }}>
            <Text style={{ fontWeight: 'bold' }}>{log.type}</Text>
            <Text>{JSON.stringify(log.payload, null, 2)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
```

## 📚 API Reference

### PaymentProvider Component

The main provider component that manages EMV payment state and initialization.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `EMVConfig` | Yes | EMV configuration object |
| `children` | `React.ReactNode` | Yes | Child components |

#### Configuration Object

```typescript
interface EMVConfig {
  merchantID: string;           // Your merchant ID
  onlineMerchantID: string;     // Your online merchant ID
  isSandBox: boolean;           // true for testing, false for production
  secureDeviceName: string;     // Terminal device name
  operatorID: string;           // Employee/operator ID
  posPackageID: string;         // App Bundle ID and version
}
```

### useEMVPayment Hook

The main hook that provides all EMV payment functionality. Must be used within a `PaymentProvider`.

#### Parameters

None - the hook automatically uses the configuration from the `PaymentProvider`.

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
| `replaceCardInRecurring` | `() => void` | Replace card in recurring setup |
| `setupConfig` | `() => void` | Setup device configuration |
| `pingConfig` | `() => void` | Ping device configuration |
| `clearTransactionListener` | `() => void` | Clear transaction listener |
| `clearAllTransactions` | `() => void` | Clear all transaction logs |
| `cancelOperation` | `() => void` | Cancel current operation |
| `initializeEMV` | `() => void` | Manually initialize EMV |
| `subscribeToEvent` | `(eventName, callback) => Listener` | Subscribe to events |
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

The package includes a complete example implementation that demonstrates:

- Complete UI implementation with modern styling
- Event handling with proper cleanup
- Error management and user feedback
- Loading states and disabled buttons
- Transaction logging with formatted display
- Multiple payment types (sale, in-house, recurring, card replacement)

### Using the Complete Example Component

```tsx
import React from 'react';
import { EMVPaymentScreenExample, EMVConfig } from 'quivio-transaction-processor';

const App = () => {
  const emvConfig: EMVConfig = {
    merchantID: "YOUR_MERCHANT_ID",
    onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
    isSandBox: true,
    secureDeviceName: "YOUR_DEVICE_NAME",
    operatorID: "YOUR_OPERATOR_ID",
    posPackageID: "com.your_app:1.0"
  };

  return <EMVPaymentScreenExample config={emvConfig} />;
};
```

### Example Features

The example component includes:

- **Device Status Display**: Real-time connection status with visual indicators
- **Configuration Management**: Setup and ping device configuration
- **Payment Operations**: 
  - Credit card payments
  - In-house payment collection
  - Recurring payment setup
  - Card replacement in recurring setups
- **Transaction Logging**: Detailed logs with timestamps and formatted display
- **Error Handling**: Comprehensive error management with user feedback
- **Loading States**: Visual feedback during operations
- **Modern UI**: Styled buttons and responsive layout

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


