import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private alertService: AlertService) { }

  /**
   * Check if all required permissions are granted
   */
  async checkAllPermissions(): Promise<boolean> {
    try {
      const permissions = await this.getRequiredPermissions();
      const results = await this.checkPermissions(permissions);
      
      const deniedPermissions = [];
      for (const [permission, granted] of Object.entries(results)) {
        if (!granted) {
          deniedPermissions.push(permission);
        }
      }
      
      if (deniedPermissions.length > 0) {
        console.warn('Missing permissions:', deniedPermissions);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Request all required permissions with user-friendly explanations
   */
  async requestAllPermissions(): Promise<boolean> {
    try {
      // First, explain why we need permissions
      const userAccepted = await this.alertService.showConfirmation(
        'Permissions Required',
        'This app needs location and WiFi permissions to scan and connect to networks. Would you like to grant these permissions?',
        'Grant Permissions',
        'Cancel'
      );

      if (!userAccepted.isConfirmed) {
        await this.alertService.showWarning(
          'Permissions Required',
          'WiFi functionality will not work without the required permissions.'
        );
        return false;
      }

      const permissions = await this.getRequiredPermissions();
      
      // Request permissions step by step with explanations
      for (const permission of permissions) {
        const isGranted = await this.requestPermissionWithExplanation(permission);
        if (!isGranted) {
          await this.alertService.showError(
            'Permission Denied',
            `${this.getPermissionName(permission)} permission is required for WiFi functionality.`
          );
          return false;
        }
      }

      await this.alertService.showSuccess(
        'Permissions Granted',
        'All required permissions have been granted. You can now use WiFi features.'
      );

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      await this.alertService.showError(
        'Permission Error',
        'Failed to request permissions. Please try again or grant them manually in device settings.'
      );
      return false;
    }
  }

  /**
   * Get list of required permissions based on Android version
   */
  private async getRequiredPermissions(): Promise<string[]> {
    const basePermissions = [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_WIFI_STATE',
      'android.permission.CHANGE_WIFI_STATE',
      'android.permission.ACCESS_NETWORK_STATE'
    ];

    // Add Android version-specific permissions
    const androidVersion = await this.getAndroidVersion();
    
    if (androidVersion >= 29) { // Android 10+
      basePermissions.push('android.permission.ACCESS_BACKGROUND_LOCATION');
    }
    
    if (androidVersion >= 33) { // Android 13+
      basePermissions.push('android.permission.NEARBY_WIFI_DEVICES');
    }

    return basePermissions;
  }

  /**
   * Check multiple permissions at once
   */
  private async checkPermissions(permissions: string[]): Promise<Record<string, boolean>> {
    return new Promise((resolve, reject) => {
      if (!window.cordova || !cordova.plugins || !cordova.plugins.permissions) {
        // For web/testing environment
        const mockResults: Record<string, boolean> = {};
        permissions.forEach(permission => mockResults[permission] = true);
        resolve(mockResults);
        return;
      }

      cordova.plugins.permissions.checkPermissions(
        permissions,
        (status: any) => {
          const results: Record<string, boolean> = {};
          for (const permission of permissions) {
            results[permission] = status.hasPermission[permission] || false;
          }
          resolve(results);
        },
        (error: any) => {
          console.error('Error checking permissions:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Request a single permission with user explanation
   */
  private async requestPermissionWithExplanation(permission: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!window.cordova || !cordova.plugins || !cordova.plugins.permissions) {
        // For web/testing environment
        resolve(true);
        return;
      }

      cordova.plugins.permissions.requestPermission(
        permission,
        (status: any) => {
          resolve(status.hasPermission || false);
        },
        (error: any) => {
          console.error(`Error requesting permission ${permission}:`, error);
          resolve(false);
        }
      );
    });
  }

  /**
   * Get user-friendly permission name
   */
  private getPermissionName(permission: string): string {
    const permissionNames: Record<string, string> = {
      'android.permission.ACCESS_FINE_LOCATION': 'Precise Location',
      'android.permission.ACCESS_COARSE_LOCATION': 'Approximate Location',
      'android.permission.ACCESS_WIFI_STATE': 'WiFi State',
      'android.permission.CHANGE_WIFI_STATE': 'WiFi Control',
      'android.permission.ACCESS_NETWORK_STATE': 'Network State',
      'android.permission.ACCESS_BACKGROUND_LOCATION': 'Background Location',
      'android.permission.NEARBY_WIFI_DEVICES': 'Nearby WiFi Devices'
    };

    return permissionNames[permission] || permission.split('.').pop() || permission;
  }

  /**
   * Get Android SDK version
   */
  private async getAndroidVersion(): Promise<number> {
    return new Promise((resolve) => {
      if (!window.cordova || !window.device) {
        resolve(30); // Default to Android 11
        return;
      }

      try {
        const version = parseInt(window.device.version.split('.')[0]);
        
        // Convert Android version to API level
        const apiLevel = this.androidVersionToApiLevel(version);
        resolve(apiLevel);
      } catch (error) {
        console.warn('Could not determine Android version:', error);
        resolve(30); // Default to Android 11
      }
    });
  }

  /**
   * Convert Android version to API level
   */
  private androidVersionToApiLevel(version: number): number {
    const versionMap: Record<number, number> = {
      6: 23,  // Android 6.0
      7: 24,  // Android 7.0
      8: 26,  // Android 8.0
      9: 28,  // Android 9
      10: 29, // Android 10
      11: 30, // Android 11
      12: 31, // Android 12
      13: 33, // Android 13
      14: 34, // Android 14
      15: 35  // Android 15
    };

    return versionMap[version] || 30;
  }

  /**
   * Open device settings for manual permission management
   */
  async openAppSettings(): Promise<void> {
    try {
      const userConfirmed = await this.alertService.showConfirmation(
        'Open Settings',
        'You can grant permissions manually in the device settings. Would you like to open the app settings?',
        'Open Settings',
        'Cancel'
      );

      if (userConfirmed.isConfirmed) {
        if (window.cordova && cordova.plugins && cordova.plugins.settings) {
          cordova.plugins.settings.open('application_details');
        } else {
          await this.alertService.showInfo(
            'Manual Setup',
            'Please go to Settings > Apps > WiFi Switcher > Permissions and enable Location and nearby devices permissions.'
          );
        }
      }
    } catch (error) {
      console.error('Error opening settings:', error);
      await this.alertService.showError(
        'Settings Error',
        'Could not open device settings. Please navigate to app permissions manually.'
      );
    }
  }

  /**
   * Show detailed permission explanation
   */
  async showPermissionExplanation(): Promise<void> {
    const explanation = `
      <div style="text-align: left;">
        <h3>Why does WiFi Switcher need these permissions?</h3>
        <br>
        <strong>📍 Location Permission:</strong><br>
        Required by Android to scan for WiFi networks. We don't track your location.
        <br><br>
        <strong>📶 WiFi Permissions:</strong><br>
        Needed to scan for networks, connect, and manage WiFi settings.
        <br><br>
        <strong>🔄 Background Location (Android 10+):</strong><br>
        Allows automatic WiFi switching even when the app is in background.
        <br><br>
        <strong>📱 Nearby Devices (Android 13+):</strong><br>
        Required for WiFi scanning on newer Android versions.
      </div>
    `;

    await this.alertService.showScrollableContent(
      'Permission Explanation',
      explanation,
      'info'
    );
  }
}

// Extend Window interface for Cordova
declare global {
  interface Window {
    cordova: any;
    device: any;
  }
}
