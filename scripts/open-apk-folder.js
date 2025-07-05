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
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function openAPKFolder() {
  const apkDir = path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'debug');
  const apkFile = path.join(apkDir, 'app-debug.apk');
  
  // Check if APK exists
  if (!fs.existsSync(apkFile)) {
    log('❌ APK file not found!', colors.red);
    log(`   Expected location: ${apkFile}`, colors.yellow);
    
    // Check if directory exists
    if (fs.existsSync(apkDir)) {
      log('📁 APK directory exists, listing contents:', colors.blue);
      const files = fs.readdirSync(apkDir);
      files.forEach(file => {
        log(`   - ${file}`, colors.cyan);
      });
    } else {
      log('📁 APK directory does not exist', colors.red);
      log('   Build may have failed or APK location changed', colors.yellow);
    }
    return;
  }
  
  // Get APK file stats
  const stats = fs.statSync(apkFile);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  log('\n🎉 APK BUILD SUCCESS! 🎉', colors.bright + colors.green);
  log('========================', colors.green);
  log(`📱 APK File: app-debug.apk`, colors.bright);
  log(`📏 Size: ${fileSizeMB} MB`, colors.blue);
  log(`📅 Created: ${stats.mtime.toLocaleString()}`, colors.blue);
  log(`📁 Location: ${apkDir}`, colors.blue);
  
  // Open folder based on platform
  try {
    const platform = process.platform;
    
    switch (platform) {
      case 'win32':
        log('\n🔓 Opening APK folder in Windows Explorer...', colors.cyan);
        // Use /select to highlight the APK file, or just open the folder
        try {
          execSync(`explorer /select,"${apkFile}"`, { stdio: 'ignore' });
        } catch (error) {
          // Fallback to just opening the folder
          execSync(`start "" "${apkDir}"`, { stdio: 'ignore', shell: true });
        }
        break;
        
      case 'darwin':
        log('\n🔓 Opening APK folder in Finder...', colors.cyan);
        execSync(`open "${apkDir}"`, { stdio: 'ignore' });
        break;
        
      case 'linux':
        log('\n🔓 Opening APK folder in file manager...', colors.cyan);
        try {
          execSync(`xdg-open "${apkDir}"`, { stdio: 'ignore' });
        } catch (error) {
          try {
            execSync(`nautilus "${apkDir}"`, { stdio: 'ignore' });
          } catch (error2) {
            log('⚠️  Could not open file manager automatically', colors.yellow);
          }
        }
        break;
        
      default:
        log('⚠️  Unknown platform, cannot open folder automatically', colors.yellow);
        break;
    }
    
    log('✅ Folder opened successfully!', colors.green);
    
  } catch (error) {
    log('⚠️  Could not open folder automatically', colors.yellow);
    log(`   Error: ${error.message}`, colors.red);
  }
  
  // Installation instructions
  log('\n📲 Installation Instructions:', colors.bright);
  log('==============================', colors.blue);
  log('1. Transfer the APK to your Android device', colors.cyan);
  log('2. Enable "Install from Unknown Sources" in device settings', colors.cyan);
  log('3. Open the APK file on your device to install', colors.cyan);
  log('4. Or use ADB: adb install app-debug.apk', colors.cyan);
  
  // Development commands
  log('\n🔧 Development Commands:', colors.bright);
  log('=========================', colors.blue);
  log('📱 Install via ADB:', colors.cyan);
  log(`   adb install "${apkFile}"`, colors.yellow);
  log('\n🔄 Reinstall (if already installed):', colors.cyan);
  log(`   adb install -r "${apkFile}"`, colors.yellow);
  log('\n📋 List connected devices:', colors.cyan);
  log('   adb devices', colors.yellow);
  log('\n🚀 Open Android Studio:', colors.cyan);
  log('   npm run capacitor:open:android', colors.yellow);
}

// Run if called directly
if (require.main === module) {
  openAPKFolder();
}

module.exports = openAPKFolder;
