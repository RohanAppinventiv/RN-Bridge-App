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
│   ├── package_base_folder/       # NPM package source
│   ├── src/                      # TypeScript source code
│   │   ├── useEMVPayment.tsx     # Main React Native hook
│   │   ├── types.ts              # TypeScript definitions
│   │   └── example/              # Example implementations
│   └── generate-package.sh       # Package generation script
│
└── 📚 Documentation
    ├── README.md                 # This file
    ├── LICENSE                   # MIT License
    └── package_base_folder/README.md  # Package documentation
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
```tsx
import { useEMVPayment } from 'quivio-transaction-processor';

const PaymentScreen = () => {
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
    loading,
    handleCardPayment,
    handleInHousePayment,
    runRecurringTransaction,
    replaceCardInRecurring,
    setupConfig,
    pingConfig,
    clearAllTransactions,
    cancelOperation,
    EVENTS
  } = useEMVPayment(emvConfig);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Device Status: {isDeviceConnected ? 'Connected' : 'Not Connected'}</Text>
      
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
      
      <Button 
        title="Setup Recurring ($2.00)" 
        onPress={() => runRecurringTransaction('2.00')}
        disabled={loading || !isDeviceConnected}
      />
      
      <Button 
        title="Replace Card" 
        onPress={replaceCardInRecurring}
        disabled={loading || !isDeviceConnected}
      />
      
      {loading && <Text>Processing...</Text>}
      
      <ScrollView>
        {logs.map((log, index) => (
          <Text key={index}>
            {log.type}: {JSON.stringify(log.payload)}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};
```

### Event Handling
```tsx
const { subscribeToEvent, EVENTS } = useEMVPayment(config);

useEffect(() => {
  // Subscribe to specific events
  subscribeToEvent(EVENTS.onSaleTransactionCompleted, (payload) => {
    console.log('Sale completed:', payload);
  });
  
  subscribeToEvent(EVENTS.onReplaceCardCompleted, (payload) => {
    console.log('Card replacement completed:', payload);
  });
  
  subscribeToEvent(EVENTS.onError, (error) => {
    console.error('Payment error:', error);
  });
}, []);
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
├── android/                 # Native Android modules
├── libs/                    # Android libraries
├── package.json             # Package configuration
└── README.md               # Package documentation
```

---

## 🏗️ Architecture

### React Native Bridge Architecture
```
React Native App (TypeScript)
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

---

*Built with ❤️ by the Quivio team*
