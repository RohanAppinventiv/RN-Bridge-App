# RN Bridge Demo: React Native ↔️ Android EMV Payment Integration

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.76%2B-blue)](https://reactnative.dev)

A professional open-source React Native project demonstrating a robust bridge to native Android code for EMV payment processing on the PAX A920 Pro device. This project integrates a native Android library (`dsiEMVAndroid.aar` from DataCap Inc.) via a Kotlin-based module, enabling seamless payment flows from JavaScript to hardware.

---

## 🚀 Features
- **React Native ↔️ Native Android Bridge**: Call native EMV payment functions from JS.
- **PAX A920 Pro Support**: Full integration with PAX payment hardware.
- **Kotlin Native Module**: Modern, idiomatic Kotlin code for Android bridging.
- **dsiEMVAndroid.aar Integration**: Uses DataCap's secure EMV payment SDK.
- **Async/Promise-based API**: Clean, promise-based interface for React Native.
- **Extensible Architecture**: Easy to adapt for other payment SDKs or devices.

---

## 🏗️ Architecture
```
App.tsx (React Native JS)
   ↓
Native Module (Kotlin, android/app)
   ↓
EMV Library (Kotlin, android/emvlib)
   ↓
dsiEMVAndroid.aar (DataCap, android/emvlib/libs)
   ↓
PAX A920 Pro Device
```

---

## 📦 Getting Started

### Prerequisites
- Node.js & npm/yarn
- [React Native CLI environment](https://reactnative.dev/docs/environment-setup)
- Android Studio (for emulator/device)
- PAX A920 Pro device (for real hardware testing)

### 1. Clone the Repo
```sh
git clone https://github.com/your-org/rn-bridge-demo.git
cd rn-bridge-demo
```

### 2. Install JS Dependencies
```sh
npm install
# or
yarn install
```

### 3. Android Native Setup
- Open `android/` in Android Studio.
- Ensure `dsiEMVAndroid.aar` is present in `android/emvlib/libs/`.
- Connect your PAX A920 Pro device or start an emulator.

### 4. Run Metro
```sh
npm start
# or
yarn start
```

### 5. Build & Run Android App
```sh
npm run android
# or
yarn android
```

---

## 🧑‍💻 Usage
- Use the UI buttons in `App.tsx` to start a transaction, get card details, or cancel.
- All logs and errors are visible in Android logcat and Metro.
- Native module methods are exposed as `NativeModules.EMVPayment` in JS.

---

## 🤝 Contributing
We welcome contributions! To get started:
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---

## 📚 Learn More
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Android Native Modules](https://reactnative.dev/docs/native-modules-android)
- [PAX A920 Pro](https://www.pax.us/terminal/a920pro/)
- [DataCap Systems](https://datacapsystems.com/)

---

> _Built with ❤️ by the open source community._
