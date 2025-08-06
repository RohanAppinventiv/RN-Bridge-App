# Quivio Transaction Processor: React Native ↔️ Android EMV Payment Integration

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.76%2B-blue)](https://reactnative.dev)

A comprehensive React Native project demonstrating robust native Android bridging for EMV payment processing. This project includes both a demo application and a reusable npm package (`quivio-transaction-processor`) for integrating EMV card reader functionality into React Native Android applications.

---

## 🚀 Features

### Application
- **React Native ↔️ Native Android Bridge**: Call native EMV payment functions from JavaScript
- **Kotlin Native Module**: Modern, idiomatic Kotlin code for Android bridging
- **dsiEMVAndroid.aar Integration**: Uses DataCap's secure EMV payment SDK
- **Async/Promise-based API**: Clean, promise-based interface for React Native
- **Extensible Architecture**: Easy to adapt for other payment SDKs or devices

### Quivio Transaction Processor Package
- **🔌 Easy Integration**: Simple hook-based API for React Native
- **💳 Full EMV Support**: Complete EMV card reading and processing capabilities
- **🤖 Android Native**: Optimized native Android implementation with EMV libraries
- **🔄 Real-time Events**: Comprehensive event system for payment status updates
- **📊 Built-in Logging**: Detailed transaction logging for debugging and monitoring
- **⚡ TypeScript Support**: Full TypeScript definitions and type safety
- **🔄 Recurring Payments**: Support for recurring payment transactions
- **🎯 Multiple Payment Types**: Support for sale, in-house, and recurring transactions
- **🛡️ Error Handling**: Robust error handling and recovery mechanisms

---

## 🏗️ Project Structure

```
RN-Bridge-App/
├── 📱 Demo Application
│   ├── App.tsx                    # Main demo application
│   ├── MainScreen.tsx             # Payment screen implementation
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
    └── package_base_folder/README.md  # Package documentation
```

---

## 📦 Getting Started

### Prerequisites
- Node.js & npm/yarn
- [React Native CLI environment](https://reactnative.dev/docs/environment-setup)
- Android Studio (for emulator/device)
- Card Reader

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
- Open `android/` in Android Studio
- Ensure `dsiEMVAndroid.aar` is present in `android/app/libs/`
- Connect your device or start an emulator

### 4. Run Metro
```bash
npm start
# or
yarn start
```

### 5. Build & Run Android App
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

### Using the Package
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

---

## 📦 Package Development

### Generate Package
```bash
./generate-package.sh
```

This script:
- Bumps the package version
- Copies source files to `quivio-transaction-processor/`
- Includes native Android libraries
- Builds TypeScript definitions
- Creates a publishable npm package

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

### Demo Application
```
App.tsx (React Native JS)
   ↓
Native Module (Kotlin, android/app)
   ↓
EMV Library (Kotlin, android/emvCardReaderLib)
   ↓
dsiEMVAndroid.aar (DataCap, android/app/libs)
   ↓
Card Reader
```

### Package Architecture
```
React Native App
   ↓
useEMVPayment Hook (TypeScript)
   ↓
Native Module Bridge (Kotlin)
   ↓
EMV Processing Libraries
   ↓
Hardware Device
```

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
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

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📚 Learn More

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Android Native Modules](https://reactnative.dev/docs/native-modules-android)
- [DataCap Systems](https://datacapsystems.com/)
- [Package Documentation](package_base_folder/README.md)

---

## 🆘 Support

For support and questions:

- 🐛 **Issues**: Open an issue on [GitHub](https://github.com/RohanAppinventiv/RN-Bridge-App)
- 📖 **Documentation**: Check the package documentation

---
