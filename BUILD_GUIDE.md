# WiFi Switcher Build Guide

This guide explains how to build and deploy the WiFi Switcher application using the improved cross-platform build system.

## 🚀 Quick Start

### Build Everything (Recommended)
```bash
npm run build
```
This single command will:
1. Clean previous builds
2. Build the Angular application
3. Sync with Capacitor
4. Build Android APK
5. Open the APK folder automatically

### Build Specific Targets
```bash
# Build web application only
npm run build:web

# Build Android APK (includes web build)
npm run build:android

# Build iOS (includes web build)
npm run build:ios

# Build only Android debug APK (no web rebuild)
npm run android:debug

# Build Android release APK
npm run android:release
```

## 📋 Prerequisites

### Required Software
1. **Node.js** (v16 or higher)
2. **Angular CLI** (`npm install -g @angular/cli`)
3. **Ionic CLI** (`npm install -g @ionic/cli`)
4. **Android Studio** with Android SDK
5. **Java Development Kit (JDK)** 8 or 11

### Environment Variables
Make sure these are set:
```bash
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk-11.0.x
```

### Verify Setup
```bash
# Check Android SDK
cd android && gradlew.bat --version

# Check Capacitor
npx cap doctor

# Check Node/NPM
node --version && npm --version
```

## 🔧 Build Commands Reference

### Main Build Scripts

| Command | Description | Output |
|---------|-------------|---------|
| `npm run build` | Complete build pipeline | APK + Web |
| `npm run build:web` | Angular build only | `dist/browser/` |
| `npm run build:android` | Web + Android build | APK + Web |
| `npm run android:debug` | Android debug APK only | `app-debug.apk` |
| `npm run android:release` | Android release APK | `app-release.apk` |

### Capacitor Commands

| Command | Description |
|---------|-------------|
| `npm run capacitor:sync` | Sync web assets with native |
| `npm run capacitor:open:android` | Open Android Studio |
| `npm run capacitor:open:ios` | Open Xcode |

### Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run watch` | Build with file watching |
| `npm test` | Run unit tests |

## 📁 Build Output Locations

### Web Build
```
dist/
└── browser/
    ├── index.html
    ├── main-*.js
    ├── styles-*.css
    └── assets/
```

### Android APK
```
android/
└── app/
    └── build/
        └── outputs/
            └── apk/
                ├── debug/
                │   └── app-debug.apk
                └── release/
                    └── app-release.apk
```

## 🔍 Build Process Details

### 1. Clean Phase
- Removes `www/` and `dist/` directories
- Clears Angular build cache

### 2. Angular Build
- Compiles TypeScript to JavaScript
- Bundles and optimizes assets
- Outputs to `dist/browser/`

### 3. Structure Fix
- Fixes nested `browser/browser/` directory issue
- Ensures proper Capacitor compatibility

### 4. Capacitor Sync
- Copies web assets to native projects
- Updates native plugin configurations
- Generates platform-specific config files

### 5. Native Build
- Compiles native Android code
- Packages into APK file
- Signs with debug or release certificate

### 6. Post-Build
- Opens APK folder automatically
- Displays build statistics
- Shows installation instructions

## 🛠️ Troubleshooting

### Common Issues

#### Build Fails - "Command not found"
```bash
# Make sure all tools are installed
npm install -g @angular/cli @ionic/cli

# Verify Android SDK
echo $ANDROID_HOME
```

#### APK Build Fails
```bash
# Check Gradle
cd android && gradlew.bat --version

# Clean and rebuild
cd android && gradlew.bat clean
npm run build
```

#### Capacitor Sync Issues
```bash
# Check Capacitor setup
npx cap doctor

# Manual sync
npx cap sync android --force
```

#### Bundle Size Warnings
The app includes SweetAlert2 which adds ~84KB to the bundle. To optimize:

1. **Lazy Load SweetAlert2**
```typescript
const Swal = await import('sweetalert2');
```

2. **Use Capacitor Dialogs** (for simple alerts)
```typescript
import { Dialog } from '@capacitor/dialog';
```

3. **Configure Budget in angular.json**
```json
"budgets": [{
  "type": "initial",
  "maximumWarning": "600kb",
  "maximumError": "1mb"
}]
```

### Missing Dependencies

#### es6-promise-plugin
```bash
npm install es6-promise-plugin
```

#### Android SDK Issues
1. Open Android Studio
2. Go to SDK Manager
3. Install latest SDK Platform
4. Install Build Tools

### Platform-Specific Issues

#### Windows
- Use PowerShell or Command Prompt
- Ensure proper path escaping
- Check Windows Defender exclusions

#### macOS/Linux
- Use Terminal
- Check file permissions: `chmod +x scripts/*.js`
- Install Xcode Command Line Tools

## 📊 Build Performance

### Typical Build Times
- **Web Only**: 10-30 seconds
- **Android APK**: 30-90 seconds
- **Clean Build**: 60-120 seconds

### Optimization Tips
1. **Use Incremental Builds**
   ```bash
   npm run android:debug  # Skip web rebuild
   ```

2. **Parallel Development**
   ```bash
   npm start  # Development server
   # In another terminal:
   npm run android:debug  # For APK testing
   ```

3. **Cache Management**
   ```bash
   # Clear all caches
   npm run build:web  # Includes cache clean
   
   # Manual cache clear
   ng cache clean
   cd android && gradlew.bat clean
   ```

## 🚀 Deployment

### Debug APK (Development)
```bash
npm run android:debug
# Install: adb install app-debug.apk
```

### Release APK (Production)
1. **Configure Signing**
   ```bash
   # Generate keystore
   keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Build Release**
   ```bash
   npm run android:release
   ```

3. **Sign APK**
   ```bash
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name
   ```

### App Store Deployment
1. Use Android Studio to generate signed AAB
2. Upload to Google Play Console
3. Follow store-specific guidelines

## 📱 Testing

### Device Testing
```bash
# List connected devices
adb devices

# Install APK
adb install app-debug.apk

# Reinstall (overwrite)
adb install -r app-debug.apk

# View logs
adb logcat | grep "WiFiSwitcher"
```

### Emulator Testing
```bash
# Start emulator
emulator -avd Pixel_4_API_30

# Install and test
npm run android:debug
```

## 🔗 Integration with IDEs

### Android Studio
```bash
npm run capacitor:open:android
```

### VS Code
Recommended extensions:
- Angular Language Service
- Ionic Extension Pack
- Android iOS Emulator

## 📈 Monitoring

### Build Metrics
- Bundle size: Check Angular build output
- APK size: Check build script output
- Build time: Logged in build script

### Performance
- Web: Use Lighthouse
- Mobile: Use Chrome DevTools with device debugging

---

## 🎯 Quick Reference

### Emergency Fixes
```bash
# Complete reset
rm -rf node_modules dist android/build
npm install
npm run build

# Capacitor issues
npx cap sync android --force
```

### Daily Development
```bash
npm start                    # Web development
npm run android:debug        # Quick APK build
npm run capacitor:open:android  # Open Android Studio
```

### Production Release
```bash
npm run build:web           # Build optimized web
npm run android:release     # Build release APK
# + Manual signing process
```

---

**Happy Building! 🎉**
