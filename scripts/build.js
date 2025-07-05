#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`\n🔄 ${description}...`, colors.cyan);
    log(`   Command: ${command}`, colors.blue);
    
    const result = execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      shell: true 
    });
    
    log(`✅ ${description} completed successfully!`, colors.green);
    return result;
  } catch (error) {
    log(`❌ ${description} failed!`, colors.red);
    log(`   Error: ${error.message}`, colors.red);
    throw error;
  }
}

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    log(`🗑️  Removing ${dirPath}...`, colors.yellow);
    fs.rmSync(dirPath, { recursive: true, force: true });
    log(`✅ ${dirPath} removed successfully!`, colors.green);
  } else {
    log(`ℹ️  Directory ${dirPath} doesn't exist, skipping removal.`, colors.blue);
  }
}

function copyFiles(srcPattern, destDir) {
  const srcDir = path.dirname(srcPattern);
  const pattern = path.basename(srcPattern);
  
  if (fs.existsSync(srcDir)) {
    log(`📁 Copying files from ${srcDir} to ${destDir}...`, colors.cyan);
    
    // Create destination if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy files
    const files = fs.readdirSync(srcDir);
    files.forEach(file => {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      } else if (fs.statSync(srcFile).isDirectory()) {
        // Recursively copy directories
        copyDirectory(srcFile, destFile);
      }
    });
    
    log(`✅ Files copied successfully!`, colors.green);
  }
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyDirectory(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

async function main() {
  try {
    log('🚀 Starting WiFi Switcher Build Process', colors.bright + colors.magenta);
    log('==========================================\n', colors.magenta);
    
    // Step 1: Clean up old builds
    log('📦 Step 1: Cleanup', colors.bright + colors.yellow);
    removeDirectory('www');
    removeDirectory('dist');
    
    // Step 2: Clean Angular cache
    log('\n📦 Step 2: Clean Angular Cache', colors.bright + colors.yellow);
    execCommand('ng cache clean', 'Cleaning Angular cache');
    
    // Step 3: Build Angular application
    log('\n📦 Step 3: Build Angular Application', colors.bright + colors.yellow);
    execCommand('ng build', 'Building Angular application');
    
    // Step 4: Fix dist structure for Capacitor
    log('\n📦 Step 4: Fix Build Structure', colors.bright + colors.yellow);
    const distBrowserPath = path.join('dist', 'browser');
    const distBrowserBrowserPath = path.join('dist', 'browser', 'browser');
    
    if (fs.existsSync(distBrowserBrowserPath)) {
      log('🔧 Fixing nested browser directory structure...', colors.cyan);
      copyFiles(path.join(distBrowserBrowserPath, '*'), distBrowserPath);
    }
    
    // Step 5: Sync with Capacitor
    log('\n📦 Step 5: Sync with Capacitor', colors.bright + colors.yellow);
    execCommand('npx cap sync android', 'Syncing with Capacitor Android');
    
    // Step 6: Build Android APK
    log('\n📦 Step 6: Build Android APK', colors.bright + colors.yellow);
    const isWindows = process.platform === 'win32';
    const gradlewCommand = isWindows ? '.\\gradlew.bat' : './gradlew';
    
    // Change to android directory and build
    process.chdir('android');
    execCommand(`${gradlewCommand} assembleDebug`, 'Building Android Debug APK');
    process.chdir('..');
    
    // Step 7: Open APK folder
    log('\n📦 Step 7: Opening APK Folder', colors.bright + colors.yellow);
    try {
      require('./open-apk-folder.js');
    } catch (error) {
      log('⚠️  Could not open APK folder automatically', colors.yellow);
      log('📁 APK location: android/app/build/outputs/apk/debug/', colors.blue);
    }
    
    // Success message
    log('\n🎉 BUILD COMPLETED SUCCESSFULLY! 🎉', colors.bright + colors.green);
    log('=====================================', colors.green);
    log('📱 Your APK is ready at:', colors.bright);
    log('   android/app/build/outputs/apk/debug/app-debug.apk', colors.blue);
    log('\n🔧 Available commands:', colors.bright);
    log('   npm run build:android    - Build for Android', colors.cyan);
    log('   npm run android:debug    - Build debug APK only', colors.cyan);
    log('   npm run android:release  - Build release APK', colors.cyan);
    log('   npm run capacitor:open:android - Open in Android Studio', colors.cyan);
    
  } catch (error) {
    log('\n💥 BUILD FAILED! 💥', colors.bright + colors.red);
    log('===================', colors.red);
    log(`Error: ${error.message}`, colors.red);
    log('\n🔍 Troubleshooting:', colors.bright);
    log('1. Make sure Android SDK is installed', colors.yellow);
    log('2. Check that ANDROID_HOME is set', colors.yellow);
    log('3. Verify Gradle is working: cd android && gradlew.bat --version', colors.yellow);
    log('4. Try building manually: npm run build:web && npm run android:debug', colors.yellow);
    
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log('\n\n⚠️  Build interrupted by user', colors.yellow);
  process.exit(1);
});

// Run the main function
main();
