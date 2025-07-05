# Android Permissions Guide for WiFi Switcher

This guide explains why specific permissions are required and how they enable WiFi functionality on different Android versions.

## 🚨 Permission Issues Fixed

### Problem
The app was showing "Scan Failed" error because essential permissions were missing from AndroidManifest.xml, particularly for modern Android versions (Android 6.0+).

### Solution
Added comprehensive permission set with runtime permission requests and user-friendly explanations.

## 📋 Required Permissions

### Core WiFi Permissions

#### `ACCESS_WIFI_STATE`
- **Purpose**: Read WiFi connection state and scan results
- **Required for**: Getting current connection info, reading scan results
- **Android level**: All versions

#### `CHANGE_WIFI_STATE`
- **Purpose**: Control WiFi adapter (enable/disable, connect/disconnect)
- **Required for**: Connecting to networks, disconnecting, enabling WiFi
- **Android level**: All versions

### Location Permissions (Critical for WiFi Scanning)

#### `ACCESS_FINE_LOCATION`
- **Purpose**: Required for WiFi scanning on Android 6.0+
- **Why needed**: Android considers WiFi scan results as location data
- **Required for**: WiFi network scanning
- **Android level**: 6.0+ (API 23+)

#### `ACCESS_COARSE_LOCATION`
- **Purpose**: Alternative/additional location permission
- **Required for**: WiFi scanning on some devices
- **Android level**: 6.0+ (API 23+)

#### `ACCESS_BACKGROUND_LOCATION`
- **Purpose**: Location access when app is in background
- **Required for**: Auto-switching when app is not active
- **Android level**: 10.0+ (API 29+)

### Network Permissions

#### `ACCESS_NETWORK_STATE`
- **Purpose**: Read network connection state
- **Required for**: Checking if device is connected to network
- **Android level**: All versions

#### `CHANGE_NETWORK_STATE`
- **Purpose**: Modify network connections
- **Required for**: Advanced network management
- **Android level**: All versions

### Modern Android Permissions

#### `NEARBY_WIFI_DEVICES`
- **Purpose**: Discover and connect to nearby WiFi devices
- **Required for**: WiFi scanning on Android 13+
- **Android level**: 13.0+ (API 33+)

### Additional Permissions

#### `WAKE_LOCK`
- **Purpose**: Keep device awake during operations
- **Required for**: Preventing sleep during long operations
- **Android level**: All versions

#### `WRITE_SETTINGS`
- **Purpose**: Modify system settings
- **Required for**: Some advanced WiFi configurations
- **Android level**: All versions

## 🔄 Permission Flow

### 1. App Startup
```
App Launch
    ↓
Check Permissions
    ↓
[Missing] → Request Permissions → [Granted] → Continue
    ↓                                ↓
[Denied] → Show Explanation → Retry/Settings
```

### 2. WiFi Operations
```
User Action (Scan/Connect)
    ↓
Check Permissions
    ↓
[Has Permissions] → Execute Operation
    ↓
[Missing] → Request → [Granted] → Execute
    ↓                    ↓
[Denied] → Show Error + Settings Option
```

## 📱 Android Version Compatibility

### Android 6.0 - 9.0 (API 23-28)
**Required Permissions:**
- `ACCESS_FINE_LOCATION` or `ACCESS_COARSE_LOCATION`
- `ACCESS_WIFI_STATE`
- `CHANGE_WIFI_STATE`

**Notes:**
- Location permission must be granted at runtime
- WiFi scanning will fail without location permission

### Android 10.0+ (API 29+)
**Additional Requirements:**
- `ACCESS_BACKGROUND_LOCATION` (for background operations)
- More restrictive location access
- Background location requires separate permission grant

**Notes:**
- Background location is separate from foreground location
- User must explicitly grant background location access
- Some OEMs may have additional restrictions

### Android 13.0+ (API 33+)
**Additional Requirements:**
- `NEARBY_WIFI_DEVICES` permission
- Replaced some location-based WiFi permissions
- More granular permission model

**Notes:**
- `NEARBY_WIFI_DEVICES` specifically for WiFi scanning
- May reduce reliance on location permissions
- Still requires location for some operations

## 🛠️ Implementation Details

### Permission Service Features
- **Runtime Permission Checking**: Automatically detects missing permissions
- **User-Friendly Explanations**: Shows why each permission is needed
- **Graceful Degradation**: Handles denied permissions appropriately
- **Settings Integration**: Opens app settings for manual permission grants
- **Version-Aware**: Requests appropriate permissions for Android version

### WiFi Service Integration
- **Pre-Operation Checks**: Validates permissions before WiFi operations
- **Automatic Requests**: Requests permissions when needed
- **Error Handling**: Provides specific error messages for permission issues
- **Retry Logic**: Allows users to retry after granting permissions

## 🔧 Troubleshooting

### Common Issues

#### "Scan Failed" Error
**Cause**: Missing location permissions
**Solution**: 
1. Check if location is enabled on device
2. Grant location permission to app
3. Ensure location permission is "Allow all the time" for background operations

#### "Permission Denied" on Android 10+
**Cause**: Background location not granted
**Solution**:
1. Go to Settings > Apps > WiFi Switcher > Permissions
2. Select "Location"
3. Choose "Allow all the time"

#### WiFi Scanning Works Sometimes
**Cause**: Inconsistent permission grants or device-specific restrictions
**Solution**:
1. Revoke and re-grant all permissions
2. Restart the app
3. Check for device-specific permission managers

### Device-Specific Issues

#### Samsung Devices
- May have additional "Nearby device scanning" permission
- Battery optimization can interfere with background operations
- Check "Device care" settings

#### Xiaomi/MIUI
- "MIUI Optimization" can block permissions
- Check "Auto-start" permissions
- Verify "Background app refresh" settings

#### Huawei/EMUI
- "Protected apps" setting may be required
- Check "Battery optimization" exclusions
- Verify "App launch" permissions

## 📋 Testing Checklist

### Permission Testing
- [ ] Fresh install permission flow
- [ ] Permission denial handling
- [ ] Settings page opening
- [ ] Background permission requests
- [ ] Android version-specific permissions

### WiFi Operation Testing
- [ ] Scan with permissions granted
- [ ] Scan with permissions denied
- [ ] Connect with proper permissions
- [ ] Background operation permissions
- [ ] Auto-switch functionality

### User Experience Testing
- [ ] Clear permission explanations
- [ ] Helpful error messages
- [ ] Easy permission recovery
- [ ] Settings integration
- [ ] Graceful permission failures

## 🔒 Privacy Considerations

### Data Usage
- **Location**: Only used for WiFi scanning, not tracked or stored
- **WiFi Information**: Used only for network management
- **Background Access**: Only for automatic network switching

### User Transparency
- Clear explanations for each permission
- No hidden or unnecessary permissions
- User control over background operations
- Easy permission management

## 📱 User Instructions

### First-Time Setup
1. **Install** the app from APK
2. **Open** the app
3. **Grant permissions** when prompted:
   - Location (required)
   - Nearby devices (Android 13+)
4. **Test scanning** to verify setup

### Permission Management
1. **Settings** > **Apps** > **WiFi Switcher** > **Permissions**
2. **Enable** required permissions:
   - Location: "Allow all the time"
   - Nearby devices: "Allow"
3. **Restart** the app if needed

### Troubleshooting Steps
1. **Check** location is enabled on device
2. **Verify** all app permissions are granted
3. **Restart** the app
4. **Contact support** if issues persist

---

## 🎯 Quick Reference

### Critical Permissions for WiFi Scanning
```
✅ ACCESS_FINE_LOCATION (Runtime)
✅ ACCESS_WIFI_STATE (Install)
✅ CHANGE_WIFI_STATE (Install)
✅ NEARBY_WIFI_DEVICES (Runtime, Android 13+)
```

### Background Operations
```
✅ ACCESS_BACKGROUND_LOCATION (Runtime, Android 10+)
✅ WAKE_LOCK (Install)
```

### Network Management
```
✅ ACCESS_NETWORK_STATE (Install)
✅ CHANGE_NETWORK_STATE (Install)
```

**Remember**: Location permission is the most critical for WiFi scanning on modern Android devices!
