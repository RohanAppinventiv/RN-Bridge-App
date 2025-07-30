#!/bin/bash
set -e

# Paths (all relative to project root)
PKG_DIR="./react-native-emv-payment"
ANDROID_DIR="./android"

# Remove old folders to ensure a clean state
rm -rf "$PKG_DIR/libs/emvCardReaderLib"
rm -rf "$PKG_DIR/libs/emvlib"
rm -rf "$PKG_DIR/libs/emvNative/src/main/java/com/rn_bridge_demo"

# Ensure target directories exist
mkdir -p "$PKG_DIR/libs/emvCardReaderLib"
mkdir -p "$PKG_DIR/libs/emvlib"
mkdir -p "$PKG_DIR/libs/emvNative/src/main/java/com/rn_bridge_demo"
mkdir -p "$PKG_DIR/src"

# 1. Clone emvCardReaderLib (libs and src)
cp -r "$ANDROID_DIR/emvCardReaderLib/libs" "$PKG_DIR/libs/emvCardReaderLib/"
cp -r "$ANDROID_DIR/emvCardReaderLib/src" "$PKG_DIR/libs/emvCardReaderLib/"

# 2. Clone emvlib (libs and src)
cp -r "$ANDROID_DIR/emvlib/libs" "$PKG_DIR/libs/emvlib/"
cp -r "$ANDROID_DIR/emvlib/src" "$PKG_DIR/libs/emvlib/"

# 3. Clone files from rn_bridge_demo except MainActivity.kt and MainApplication.kt
RN_BRIDGE_SRC="$ANDROID_DIR/app/src/main/java/com/rn_bridge_demo"
EMVNATIVE_TARGET="$PKG_DIR/libs/emvNative/src/main/java/com/rn_bridge_demo"
for file in "$RN_BRIDGE_SRC"/*.kt; do
  fname=$(basename "$file")
  if [[ "$fname" != "MainActivity.kt" && "$fname" != "MainApplication.kt" ]]; then
    cp "$file" "$EMVNATIVE_TARGET/"
  fi
done

# 4. Clone useEMVPayment.tsx to src/useEMVPayment.ts (overwrite)
cp "./useEMVPayment.tsx" "$PKG_DIR/src/useEMVPayment.ts"

# 5. Ensure AndroidManifest.xml exists at the correct location
cat > "$PKG_DIR/libs/emvNative/src/main/AndroidManifest.xml" <<EOF
<?xml version="1.0" encoding="utf-8"?>
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android">
</manifest>
EOF

echo "Native libs and hooks synced successfully!" 