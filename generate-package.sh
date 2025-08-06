#!/bin/bash

# Script to generate quivio-transaction-processor package
# This script clones the required folders and files to create the package structure

set -e  # Exit on any error

echo "Starting package generation..."

# Define the target directory
TARGET_DIR="quivio-transaction-processor"

# Bump version in package_base_folder
echo "Bumping version in package_base_folder..."
cd package_base_folder
npm version patch
cd ..

# Remove target directory if it exists
if [ -d "$TARGET_DIR" ]; then
    echo "Removing existing $TARGET_DIR directory..."
    rm -rf "$TARGET_DIR"
fi

# Create target directory
echo "Creating $TARGET_DIR directory..."
mkdir -p "$TARGET_DIR"

# 1. Clone package_base_folder as quivio-transaction-processor
echo "Cloning package_base_folder..."
cp -r package_base_folder/* "$TARGET_DIR/"


# 2. Clone src root folder to quivio-transaction-processor
echo "Cloning src folder..."
cp -r src "$TARGET_DIR/"

# 3. Clone android/emvCardReaderLib to quivio-transaction-processor/libs
echo "Cloning emvCardReaderLib ..."
mkdir -p "$TARGET_DIR/libs"
cp -r android/emvCardReaderLib "$TARGET_DIR/libs/"

# 4. Clone android/app/src/main/java to quivio-transaction-processor/libs/emvNative/src/main
echo "Cloning Java source files..."
mkdir -p "$TARGET_DIR/libs/emvNative/src/main"
cp -r android/app/src/main/java "$TARGET_DIR/libs/emvNative/src/main/"

# 5. Create AndroidManifest.xml in quivio-transaction-processor/libs/emvNative/src/main
echo "Creating AndroidManifest.xml..."
cat > "$TARGET_DIR/libs/emvNative/src/main/AndroidManifest.xml" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android">
</manifest>
EOF

# 6. Clone LICENSE file from root
echo "Copying LICENSE file from root..."
if [ -f "LICENSE" ]; then
    cp LICENSE "$TARGET_DIR/"
    echo "LICENSE file copied successfully"
else
    echo "Warning: LICENSE file not found in root directory"
fi

# 7. Clone .npmignore file from package_base_folder
echo "Cloning .npmignore file..."
if [ -f "package_base_folder/.npmignore" ]; then
    cp package_base_folder/.npmignore "$TARGET_DIR/"
    echo ".npmignore file copied successfully"
else
    echo "Warning: .npmignore file not found in package_base_folder"
fi

# 8. Remove build directories if they exist
echo "Cleaning build directories..."
if [ -d "$TARGET_DIR/libs/emvCardReaderLib/build" ]; then
    rm -rf "$TARGET_DIR/libs/emvCardReaderLib/build"
    echo "Removed emvCardReaderLib/build directory"
fi

# Remove specific files that shouldn't be in the package
echo "Removing specific files..."
if [ -f "$TARGET_DIR/libs/emvNative/src/main/java/com/quivio_transaction_processor/MainActivity.kt" ]; then
    rm "$TARGET_DIR/libs/emvNative/src/main/java/com/quivio_transaction_processor/MainActivity.kt"
    echo "Removed MainActivity.kt file"
fi
if [ -f "$TARGET_DIR/libs/emvNative/src/main/java/com/quivio_transaction_processor/MainApplication.kt" ]; then
    rm "$TARGET_DIR/libs/emvNative/src/main/java/com/quivio_transaction_processor/MainApplication.kt"
    echo "Removed MainApplication.kt file"
fi

# 9. Build the package
echo "Building the package..."
cd "$TARGET_DIR"
npm run build
cd ..

echo "Package generation completed successfully!"
echo "Generated package is located in: $TARGET_DIR"

