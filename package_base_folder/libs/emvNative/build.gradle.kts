plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.quivio_transaction_processor"
    compileSdk = 34

    defaultConfig {
        minSdk = 23
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // Required for React Native bridge classes (ReactContext, WritableMap, etc.)
    implementation("com.facebook.react:react-native:+") {
        exclude(group = "com.facebook.fbjni") // optional: prevent version conflicts
    }

    // Kotlin coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")

    // Internal modules
    implementation(project(":emvlib"))
    implementation(project(":emvCardReaderLib"))
}
