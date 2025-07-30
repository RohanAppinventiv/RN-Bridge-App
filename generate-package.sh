#!/bin/bash

# Script to generate react-native-emv-payment package
# This script clones the required folders and files to create the package structure

set -e  # Exit on any error

echo "Starting package generation..."

# Define the target directory
TARGET_DIR="react-native-emv-payment"

# Remove target directory if it exists
if [ -d "$TARGET_DIR" ]; then
    echo "Removing existing $TARGET_DIR directory..."
    rm -rf "$TARGET_DIR"
fi

# Create target directory
echo "Creating $TARGET_DIR directory..."
mkdir -p "$TARGET_DIR"

# 1. Clone package_base_folder as react-native-emv-payment
echo "Cloning package_base_folder..."
cp -r package_base_folder/* "$TARGET_DIR/"

# 2. Clone src root folder to react-native-emv-payment
echo "Cloning src folder..."
cp -r src "$TARGET_DIR/"

# 3. Clone android/emvCardReaderLib and android/emvlib to react-native-emv-payment/libs
echo "Cloning emvCardReaderLib and emvlib..."
mkdir -p "$TARGET_DIR/libs"
cp -r android/emvCardReaderLib "$TARGET_DIR/libs/"
cp -r android/emvlib "$TARGET_DIR/libs/"

# 4. Clone android/app/src/main/java to react-native-emv-payment/libs/emvNative/src/main
echo "Cloning Java source files..."
mkdir -p "$TARGET_DIR/libs/emvNative/src/main"
cp -r android/app/src/main/java "$TARGET_DIR/libs/emvNative/src/main/"

# 5. Create AndroidManifest.xml in react-native-emv-payment/libs/emvNative/src/main
echo "Creating AndroidManifest.xml..."
cat > "$TARGET_DIR/libs/emvNative/src/main/AndroidManifest.xml" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android">
</manifest>
EOF

# 6. Clone .npmignore file from react-native-emv-payment-npm-package
echo "Cloning .npmignore file..."
if [ -f "react-native-emv-payment-npm-package/.npmignore" ]; then
    cp react-native-emv-payment-npm-package/.npmignore "$TARGET_DIR/"
    echo ".npmignore file copied successfully"
else
    echo "Warning: .npmignore file not found in react-native-emv-payment-npm-package"
fi

# 7. Remove build directories if they exist
echo "Cleaning build directories..."
if [ -d "$TARGET_DIR/libs/emvCardReaderLib/build" ]; then
    rm -rf "$TARGET_DIR/libs/emvCardReaderLib/build"
    echo "Removed emvCardReaderLib/build directory"
fi
if [ -d "$TARGET_DIR/libs/emvlib/build" ]; then
    rm -rf "$TARGET_DIR/libs/emvlib/build"
    echo "Removed emvlib/build directory"
fi

# Remove specific files that shouldn't be in the package
echo "Removing specific files..."
if [ -f "$TARGET_DIR/libs/emvNative/src/main/java/com/rn_bridge_demo/MainActivity.kt" ]; then
    rm "$TARGET_DIR/libs/emvNative/src/main/java/com/rn_bridge_demo/MainActivity.kt"
    echo "Removed MainActivity.kt file"
fi
if [ -f "$TARGET_DIR/libs/emvNative/src/main/java/com/rn_bridge_demo/MainApplication.kt" ]; then
    rm "$TARGET_DIR/libs/emvNative/src/main/java/com/rn_bridge_demo/MainApplication.kt"
    echo "Removed MainApplication.kt file"
fi

# 8. Build the package
echo "Building the package..."
cd "$TARGET_DIR"
npm run build
cd ..

echo "Package generation completed successfully!"
echo "Generated package is located in: $TARGET_DIR"

