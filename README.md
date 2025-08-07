# Quivio Transaction Processor: React Native ↔️ Android EMV Payment Integration

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.80%2B-blue)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![Kotlin](https://img.shields.io/badge/Kotlin-1.8%2B-orange)](https://kotlinlang.org/)

A comprehensive React Native project demonstrating robust native Android bridging for EMV payment processing using DataCap's dsiEMVAndroid SDK. This project includes both a demo application and a reusable npm package (`quivio-transaction-processor`) for integrating EMV card reader functionality into React Native Android applications.

---

## 🚀 Features

### Core Features
- **🔌 React Native ↔️ Native Android Bridge**: Seamless communication between React Native and native Android EMV payment functions
- **💳 Full EMV Support**: Complete EMV card reading and processing capabilities using DataCap's dsiEMVAndroid.aar
- **🤖 Kotlin Native Module**: Modern, idiomatic Kotlin code for Android bridging with comprehensive error handling
- **⚡ TypeScript Support**: Full TypeScript definitions and type safety throughout the codebase
- **🔄 Real-time Events**: Comprehensive event system for payment status updates and device communication
- **📊 Built-in Logging**: Detailed transaction logging for debugging and monitoring
- **🛡️ Error Handling**: Robust error handling and recovery mechanisms

### Payment Operations
- **💳 Sale Transactions**: Process standard EMV card payments with configurable amounts
- **🏠 In-House Payments**: Support for in-house payment processing
- **🔄 Recurring Payments**: Setup and manage recurring payment transactions
- **🔄 Card Replacement**: Replace cards in existing recurring payment setups
- **⚙️ Device Configuration**: Setup and ping device configurations
- **❌ Transaction Cancellation**: Cancel ongoing transactions
- **📋 Transaction Logging**: Comprehensive logging of all transaction events

### Technical Features
- **🎯 Multiple Payment Types**: Support for sale, in-house, recurring, and card replacement transactions
- **🔧 Device Management**: Device connection status monitoring and configuration
- **📱 Cross-Platform Ready**: Android implementation with iOS structure in place
- **🧪 Testing Support**: Jest configuration and test structure
- **📦 Package Distribution**: Automated package generation and publishing scripts

---

## 🏗️ Project Structure

```
RN-Bridge-App/
├── 📱 Demo Application
│   ├── App.tsx                    # Main application entry point
│   ├── MainScreen.tsx             # Welcome screen with demo navigation
│   ├── index.js                   # React Native entry point
│   └── android/                   # Android native modules
│       ├── app/                   # Main Android app
│       ├── emvCardReaderLib/      # EMV card reader library
│       
│
├── 📦 Quivio Transaction Processor Package
│   ├── src/                      # TypeScript source code
│   │   ├── index.ts              # Main package exports
│   │   ├── types.ts              # TypeScript definitions
│   │   ├── PaymentProvider.tsx   # React Context Provider
│   │   ├── useEMVPayment.tsx    # Main React hook
│   │   └── example/              # Example implementations
│   │       └── EMVPaymentScreen.tsx
│   ├── package_base_folder/      # NPM package source
│   └── generate-package.sh       # Package generation script
│
└── 📚 Documentation
    ├── README.md                 # This file
    └── LICENSE                   # MIT License
```

---

## 📦 Getting Started

### Prerequisites
- **Node.js** >= 18
- **React Native CLI** environment setup
- **Android Studio** (for emulator/device)
- **DataCap EMV Card Reader** or compatible device
- **dsiEMVAndroid.aar** SDK file (included in project)

### 1. Clone the Repository
```bash
git clone https://github.com/RohanAppinventiv/RN-Bridge-App.git
cd RN-Bridge-App
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Android Native Setup
```bash
# Open Android Studio and sync the project
cd android
./gradlew clean
cd ..

# Ensure dsiEMVAndroid.aar is present in android/app/libs/
# Connect your EMV card reader device or start an emulator
```

### 4. Configuration Setup
Create a `utils/config.ts` file in the root directory:
```typescript
import { EMVConfig } from './src/types';

export const emvConfig: EMVConfig = {
  merchantID: "YOUR_MERCHANT_ID",
  onlineMerchantID: "YOUR_ONLINE_MERCHANT_ID", 
  isSandBox: true, // true for testing, false for production
  secureDeviceName: "YOUR_DEVICE_NAME", // Terminal device name
  operatorID: "YOUR_OPERATOR_ID", // Employee ID
  posPackageID: "com.quivio_transaction_processor:1.0" // App Bundle ID and version
};
```

### 5. Run Metro Bundler
```bash
npm start
# or
yarn start
```

### 6. Build & Run Android App
```bash
npm run android
# or
yarn android
```

---

## 🧑‍💻 Usage

### Application
- Use the UI buttons in `App.tsx` to start a transaction, get card details, or cancel
- All logs and errors are visible in Android logcat and Metro
- Native module methods are exposed as `NativeModules.EMVPayment` in JS

1. **Welcome Screen**: Tap "Go to Demo" to access the payment interface
2. **Device Status**: View real-time device connection status
3. **Payment Operations**: 
   - Setup Configuration: Initialize device connection
   - Pay via Credit Card: Process $10.00 sale transaction
   - Pay via In-house: Collect card details for in-house processing
   - Setup Recurring: Create recurring payment for $1.50
   - Replace Recurring Card: Replace card in existing recurring setup
   - Clear All: Clear transaction logs
4. **Real-time Logging**: View detailed transaction logs and events

### Using the Package in Your App

#### Basic Usage with PaymentProvider
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
  posPackageID: "com.your_app:1.0"
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
    handleInHousePayment,
    runRecurringTransaction,
    replaceCardInRecurring,
    setupConfig,
    pingConfig,
    clearAllTransactions,
    cancelOperation,
    EVENTS
  } = useEMVPayment();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Device Status: {isDeviceConnected ? '✅ Connected' : '❌ Not Connected'}
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
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: (loading || !isDeviceConnected) ? '#ccc' : '#9C27B0', 
          padding: 12, 
          borderRadius: 8,
          marginBottom: 10
        }}
        onPress={() => runRecurringTransaction('2.00')}
        disabled={loading || !isDeviceConnected}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Setup Recurring ($2.00)
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ 
          backgroundColor: (loading || !isDeviceConnected) ? '#ccc' : '#FF5722', 
          padding: 12, 
          borderRadius: 8,
          marginBottom: 10
        }}
        onPress={replaceCardInRecurring}
        disabled={loading || !isDeviceConnected}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Replace Card
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

### Event Handling
```tsx
import React, { useEffect } from 'react';
import { useEMVPayment } from 'quivio-transaction-processor';

const PaymentComponent = () => {
  const { subscribeToEvent, unsubscribeFromEvent, EVENTS } = useEMVPayment();

  useEffect(() => {
    // Subscribe to specific events
    const saleListener = subscribeToEvent(EVENTS.onSaleTransactionCompleted, (payload) => {
      console.log('Sale completed:', payload);
      // Handle successful sale transaction
    });
    
    const replaceCardListener = subscribeToEvent(EVENTS.onReplaceCardCompleted, (payload) => {
      console.log('Card replacement completed:', payload);
      // Handle successful card replacement
    });
    
    const errorListener = subscribeToEvent(EVENTS.onError, (error) => {
      console.error('Payment error:', error);
      // Handle payment errors
    });

    const configSuccessListener = subscribeToEvent(EVENTS.onConfigCompleted, (payload) => {
      console.log('Configuration completed:', payload);
      // Handle successful configuration
    });

    const deviceConnectedListener = subscribeToEvent(EVENTS.onConfigPingSuccess, (payload) => {
      console.log('Device connected:', payload);
      // Handle device connection success
    });

    // Cleanup listeners when component unmounts
    return () => {
      if (saleListener) unsubscribeFromEvent(EVENTS.onSaleTransactionCompleted, saleListener.listener);
      if (replaceCardListener) unsubscribeFromEvent(EVENTS.onReplaceCardCompleted, replaceCardListener.listener);
      if (errorListener) unsubscribeFromEvent(EVENTS.onError, errorListener.listener);
      if (configSuccessListener) unsubscribeFromEvent(EVENTS.onConfigCompleted, configSuccessListener.listener);
      if (deviceConnectedListener) unsubscribeFromEvent(EVENTS.onConfigPingSuccess, deviceConnectedListener.listener);
    };
  }, [subscribeToEvent, unsubscribeFromEvent, EVENTS]);

  return (
    // Your component JSX
  );
};
```

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

---

## 📦 Package Development

### Generate Package
```bash
npm run generate-package
```

This script:
- Bumps the package version
- Copies source files to `quivio-transaction-processor/`
- Includes native Android libraries
- Builds TypeScript definitions
- Creates a publishable npm package

### Publish Package
```bash
npm run publish
```

This will generate and publish the package to npm.

### Package Structure
```
quivio-transaction-processor/
├── dist/                    # Built JavaScript files
├── src/                     # TypeScript source
│   ├── index.ts             # Main package exports
│   ├── types.ts             # TypeScript definitions
│   ├── PaymentProvider.tsx  # React Context Provider
│   ├── useEMVPayment.tsx   # Main React hook
│   └── example/             # Example implementations
│       └── EMVPaymentScreen.tsx
├── android/                 # Native Android modules
├── libs/                    # Android libraries
├── package.json             # Package configuration
└── README.md               # Package documentation
```

### Main Exports
```typescript
// Main exports from the package
export {
  PaymentProvider,           // React Context Provider
  useEMVPayment,            // Main React hook
  EMVPaymentScreenExample   // Complete example component
};

export type {
  EMVEventName,             // Event name types
  CallbackLog,              // Log entry type
  EMVPaymentHook,           // Hook interface
  EMVConfig                 // Configuration interface
};
```

---

## 🏗️ Architecture

### React Native Bridge Architecture
```
React Native App (TypeScript)
   ↓
PaymentProvider (React Context)
   ↓
useEMVPayment Hook (TypeScript)
   ↓
Native Module Bridge (Kotlin)
   ↓
EMV Transaction Manager (Kotlin)
   ↓
DataCap dsiEMVAndroid.aar SDK
   ↓
EMV Card Reader Hardware
```

### Event Flow
```
User Action → React Native Hook → Native Module → EMV Manager → SDK → Hardware
   ↓
Hardware Response → SDK → EMV Manager → Native Module → React Native Event → UI Update
```

### Key Components

#### React Native Layer
- **`PaymentProvider`**: React Context Provider for payment state management
- **`useEMVPayment`**: Main hook providing payment functionality
- **`EMVPaymentScreenExample`**: Complete example implementation
- **`types.ts`**: TypeScript definitions and interfaces

#### Native Android Layer
- **`DsiEMVManagerModule`**: React Native bridge module
- **`DsiEMVManager`**: EMV transaction orchestration
- **`POSTransactionExecutor`**: Transaction execution
- **`DsiEMVRequestBuilder`**: XML request generation
- **`XMLResponseExtractor`**: Response parsing

#### SDK Integration
- **`dsiEMVAndroid.aar`**: DataCap's EMV payment SDK
- **XML-based Communication**: Standard EMV protocol
- **Secure Device Communication**: Hardware-level security

---

## 🔧 Architecture Overview

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

---

## 🔧 Configuration

### EMV Configuration Interface
```typescript
interface EMVConfig {
  merchantID: string;           // Your merchant ID
  onlineMerchantID: string;     // Online merchant ID
  isSandBox: boolean;           // true for testing, false for production
  secureDeviceName: string;     // Terminal device name
  operatorID: string;           // Employee/operator ID
  posPackageID: string;         // App bundle ID and version
}
```

### Available Events
```typescript
const EVENT_NAMES = [
  'onError',                    // Error events
  'onCardReadSuccessfully',     // Card read success
  'onSaleTransactionCompleted', // Sale transaction completed
  'onRecurringSaleCompleted',   // Recurring sale completed
  'onReplaceCardCompleted',     // Card replacement completed
  'onShowMessage',              // Display messages
  'onConfigError',              // Configuration errors
  'onConfigPingFailed',         // Configuration ping failed
  'onConfigPingSuccess',        // Configuration ping success
  'onConfigCompleted',          // Configuration setup completed
] as const;

// Available hook methods:
interface EMVPaymentHook {
  logs: CallbackLog[];                    // Transaction logs
  isDeviceConnected: boolean;             // Device connection status
  loading: boolean;                       // Loading state
  isInitialized: boolean;                 // Initialization status
  handleCardPayment: (amount: string) => void;           // Process card payment
  handleInHousePayment: () => void;                      // Collect card details
  runRecurringTransaction: (amount: string) => void;     // Setup recurring payment
  replaceCardInRecurring: () => void;                    // Replace card in recurring
  setupConfig: () => void;                               // Setup device configuration
  pingConfig: () => void;                                // Ping device status
  clearTransactionListener: () => void;                  // Clear transaction listener
  clearAllTransactions: () => void;                      // Clear all logs
  cancelOperation: () => void;                           // Cancel current operation
  initializeEMV: () => void;                             // Initialize EMV manager
  subscribeToEvent: (eventName: EMVEventName, callback: (payload: any) => void) => void;
  unsubscribeFromEvent: (eventName: EMVEventName, callback: (payload: any) => void) => void;
  EVENTS: Record<EMVEventName, EMVEventName>;           // Available events
}
```

---

## 🤝 Contributing

We welcome contributions! This is an open-source project and we appreciate any help.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/RohanAppinventiv/RN-Bridge-App.git

# Install dependencies
npm install

# Setup Android development environment
cd android
./gradlew clean
cd ..

# Start development
npm start
```

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/your-feature`)
3. **Make your changes** following the existing code style
4. **Add tests** if applicable
5. **Update documentation** as needed
6. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
7. **Push to the branch** (`git push origin feature/your-feature`)
8. **Open a Pull Request**

### Code Style
- **TypeScript**: Use strict typing and interfaces
- **Kotlin**: Follow Android/Kotlin best practices
- **React Native**: Use functional components with hooks
- **Documentation**: Update README and inline comments


---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🆘 Support

For support and questions:

- 🐛 **Issues**: Open an issue on [GitHub](https://github.com/RohanAppinventiv/RN-Bridge-App)
- 📖 **Documentation**: Check the package documentation in `package_base_folder/README.md`
- 💬 **Discussions**: Use GitHub Discussions for questions and ideas

---

## 📚 Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Android Native Modules](https://reactnative.dev/docs/legacy/native-modules-android)
- [DataCap Systems](https://datacapsystems.com/)
- [EMV Payment Standards](https://www.emvco.com/)
- [Kotlin for Android](https://kotlinlang.org/docs/android-overview.html)

---

## 🙏 Acknowledgments

- **DataCap Systems** for providing the EMV SDK
- **React Native Community** for the excellent bridging documentation
- **Open Source Contributors** who help improve this project

---

## 📈 Roadmap

- [ ] All cases of Recurring Account
- [ ] Additional payment methods (contactless, mobile payments)
- [ ] Enhanced error handling and recovery
- [ ] Performance optimizations
- [ ] Pay via In-house cards



