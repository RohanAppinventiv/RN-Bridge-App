# quivio-transaction-processor

A React Native hook for EMV payment integration with DataCap. This package provides a simple and efficient way to integrate EMV card reader functionality into your React Native Android applications.

## Features

- 🔌 **Easy Integration**: Simple hook-based API for React Native
- 💳 **EMV Card Support**: Full EMV card reading and processing
- 🤖 **Android Only**: Native Android implementation with EMV libraries
- 🔄 **Real-time Events**: Subscribe to payment events and status updates
- 📊 **Transaction Logging**: Built-in logging for debugging and monitoring
- ⚡ **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
npm install quivio-transaction-processor
# or
yarn add quivio-transaction-processor
```

### Android Setup

The package includes native Android libraries that need to be properly configured. Follow these steps:

#### 1. Add dsiEMVAndroid.aar file

First, add the `dsiEMVAndroid.aar` file to your `android/app/libs/` folder. This is a critical step as it contains the core EMV functionality.

**Note**: Make sure the `libs` folder exists in your `android/app/` directory. If it doesn't exist, create it first.

#### 2. Update settings.gradle

Add the following lines to your `android/settings.gradle`:

```gradle
include ':emvlib'
project(':emvlib').projectDir = file('../node_modules/quivio-transaction-processor/libs/emvlib')
include ':emvCardReaderLib'
project(':emvCardReaderLib').projectDir = file('../node_modules/quivio-transaction-processor/libs/emvCardReaderLib')
include ':emvNative'
project(':emvNative').projectDir = file('../node_modules/quivio-transaction-processor/libs/emvNative')
```

#### 3. Update app/build.gradle

Add the following dependencies to your `android/app/build.gradle`:

```gradle
dependencies {
    // ... other dependencies
    implementation files("libs/dsiEMVAndroid.aar")
    implementation project(":emvlib")
    implementation project(":emvCardReaderLib")
    implementation project(":emvNative")
}
```

**Important**: The `implementation files("libs/dsiEMVAndroid.aar")` line is crucial and must be included for the EMV functionality to work.

#### 4. Update MainApplication.kt

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

#### 5. Permissions

Make sure you have the necessary permissions in your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## Usage

### Basic Example

```tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useEMVPayment } from 'quivio-transaction-processor';

const PaymentScreen = () => {
  // EMV Configuration - Replace with your actual values
  const emvConfig = {
    merchantID: "YOUR_MERCHANT_ID",
    onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
    isSandBox: true, // true for testing, false for production
    secureDeviceName: "YOUR_DEVICE_NAME", // Terminal device name
    operatorID: "YOUR_OPERATOR_ID" // Employee ID
  };

  const {
    isDeviceConnected,
    loading,
    handleCardPayment,
    setupConfig,
    logs
  } = useEMVPayment(emvConfig);

  return (
    <View>
      <Text>Device Status: {isDeviceConnected ? 'Connected' : 'Not Connected'}</Text>
      
      <Button 
        title="Setup Configuration" 
        onPress={setupConfig}
        disabled={loading}
      />
      
      <Button 
        title="Process Payment ($10.00)" 
        onPress={() => handleCardPayment('10.00')}
        disabled={loading || !isDeviceConnected}
      />
      
      {loading && <Text>Processing...</Text>}
    </View>
  );
};
```

### Advanced Example with Event Handling

```tsx
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useEMVPayment } from 'quivio-transaction-processor';

const AdvancedPaymentScreen = () => {
  // EMV Configuration - Replace with your actual values
  const emvConfig = {
    merchantID: "YOUR_MERCHANT_ID",
    onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID",
    isSandBox: true, // true for testing, false for production
    secureDeviceName: "YOUR_DEVICE_NAME", // Terminal device name
    operatorID: "YOUR_OPERATOR_ID" // Employee ID
  };

  const {
    isDeviceConnected,
    loading,
    handleCardPayment,
    handleInHousePayment,
    setupConfig,
    pingConfig,
    subscribeToEvent,
    unsubscribeFromEvent,
    EVENTS,
    logs
  } = useEMVPayment(emvConfig);

  useEffect(() => {
    // Subscribe to payment events
    const handleSaleCompleted = (payload) => {
      console.log('Sale completed:', payload);
    };

    const handleCardRead = (payload) => {
      console.log('Card read successfully:', payload);
    };

    const handleError = (payload) => {
      console.error('Payment error:', payload);
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
      <Text>Device Status: {isDeviceConnected ? 'Connected' : 'Not Connected'}</Text>
      
      <Button title="Setup Config" onPress={setupConfig} />
      <Button title="Ping Config" onPress={pingConfig} />
      <Button title="EMV Sale" onPress={() => handleCardPayment('25.00')} />
      <Button title="In-House Payment" onPress={handleInHousePayment} />
      
      {loading && <Text>Processing...</Text>}
    </View>
  );
};
```

## API Reference

### useEMVPayment Hook

The main hook that provides all EMV payment functionality.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | `EMVConfig` | Yes | EMV configuration object |

#### Configuration Object

```typescript
interface EMVConfig {
  merchantID: string;
  onlineMerchantID: string;
  isSandBox: boolean;
  secureDeviceName: string;
  operatorID: string;
}
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `logs` | `CallbackLog[]` | Array of transaction logs |
| `isDeviceConnected` | `boolean` | Device connection status |
| `loading` | `boolean` | Loading state for operations |
| `handleCardPayment` | `(amount: string) => void` | Process EMV card payment |
| `handleInHousePayment` | `() => void` | Process in-house payment |
| `setupConfig` | `() => void` | Setup device configuration |
| `pingConfig` | `() => void` | Ping device configuration |
| `clearTransactionListener` | `() => void` | Clear transaction listeners |
| `subscribeToEvent` | `(eventName, callback) => void` | Subscribe to events |
| `unsubscribeFromEvent` | `(eventName, callback) => void` | Unsubscribe from events |
| `EVENTS` | `Record<EMVEventName, EMVEventName>` | Available event names |

### Event Types

The following events are available for subscription:

- `onError` - Payment or device errors
- `onCardReadSuccessfully` - Card successfully read
- `onSaleTransactionCompleted` - Sale transaction completed
- `onShowMessage` - Display messages from device
- `onConfigError` - Configuration errors
- `onConfigPingFailed` - Configuration ping failed
- `onConfigPingSuccess` - Configuration ping successful
- `onConfigCompleted` - Configuration setup completed

### Types

```typescript
interface EMVConfig {
  merchantID: string;
  onlineMerchantID: string;
  isSandBox: boolean;
  secureDeviceName: string;
  operatorID: string;
}

interface CallbackLog {
  type: string;
  payload: any;
  timestamp: number;
}

type EMVEventName = 
  | 'onError'
  | 'onCardReadSuccessfully'
  | 'onSaleTransactionCompleted'
  | 'onShowMessage'
  | 'onConfigError'
  | 'onConfigPingFailed'
  | 'onConfigPingSuccess'
  | 'onConfigCompleted';
```

## Device Requirements

- Android device with compatible EMV card reader
- Bluetooth connectivity (for wireless devices)
- Android 5.0 (API level 21) or higher
- Proper device drivers and SDK installed

## Troubleshooting

### Common Issues

1. **Device not connecting**
   - Ensure the device is powered on and in pairing mode
   - Check Bluetooth permissions
   - Verify device compatibility

2. **Payment processing fails**
   - Check device connection status
   - Verify card is properly inserted/swiped
   - Ensure proper amount format (e.g., "10.00")

3. **Events not firing**
   - Make sure you're subscribed to the correct events
   - Check that the device is properly configured

### Debug Mode

The hook provides detailed logging through the `logs` array. You can display these logs to debug issues:

```tsx
{logs.map((log, index) => (
  <Text key={index}>
    {log.type}: {JSON.stringify(log.payload)}
  </Text>
))}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on the GitHub repository or contact the maintainers.

