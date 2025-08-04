plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.quivioedge.emvlib"
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
    compileOnly(files("../app/libs/dsiEMVAndroid.aar"))
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
} 