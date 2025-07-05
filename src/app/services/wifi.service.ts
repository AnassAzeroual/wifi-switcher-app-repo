import { Injectable } from '@angular/core';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2/ngx';
import { AlertService } from './alert.service';

export interface WifiNetwork {
  ssid: string;
  bssid: string;
  level: number;    // RSSI
  frequency: number;
}

@Injectable({ providedIn: 'root' })
export class WifiService {
  constructor(
    private readonly wifi: WifiWizard2,
    private readonly alertService: AlertService
  ) {}

  /**
   * Scan for available networks and normalize results.
   */
  async scan(): Promise<WifiNetwork[]> {
    try {
      this.alertService.showLoading('Scanning for WiFi networks...');
      
      // trigger native scan
      await this.wifi.scan();
      // fetch and map to our interface
      const raw = await this.wifi.getScanResults({ numLevels: 5 });
      
      this.alertService.close();
      
      return raw.map((r: { SSID: any; BSSID: any; level: any; frequency: any; }) => ({
        ssid: r.SSID,
        bssid: r.BSSID,
        level: r.level,
        frequency: r.frequency
      }));
    } catch (error) {
      this.alertService.close();
      await this.alertService.showError('Scan Failed', 'Failed to scan for WiFi networks. Please check your permissions.');
      throw error;
    }
  }

  /**
   * Sort networks descending by signal strength.
   */
  sortByStrength(networks: WifiNetwork[]): WifiNetwork[] {
    return networks.sort((a, b) => b.level - a.level);
  }

  /**
   * Connect to a known network.
   * @param ssid    SSID string
   * @param password Plain-text password
   */
  async connect(ssid: string, password: string): Promise<void> {
    try {
      this.alertService.showLoading(`Connecting to ${ssid}...`);
      
      // `false` means not using WEP
      await this.wifi.connect(ssid, false, password);
      
      this.alertService.close();
      await this.alertService.showSuccess('Connected!', `Successfully connected to ${ssid}`);
    } catch (error) {
      this.alertService.close();
      await this.alertService.showError('Connection Failed', `Failed to connect to ${ssid}. Please check your password and try again.`);
      throw error;
    }
  }

  /**
   * Scans, picks the strongest known network, and connects if not already connected.
   */
  async autoSwitch(known: { ssid: string; password: string }[]): Promise<void> {
    try {
      this.alertService.showLoading('Finding best network...');
      
      const list = await this.scan();
      const sorted = this.sortByStrength(list);
      
      let foundNetwork = false;
      
      for (const net of sorted) {
        const match = known.find(n => n.ssid === net.ssid);
        if (!match) {
          continue;
        }
        
        foundNetwork = true;
        const current = await this.wifi.getConnectedSSID();
        
        if (current !== net.ssid) {
          this.alertService.close();
          await this.connect(match.ssid, match.password);
        } else {
          this.alertService.close();
          await this.alertService.showInfo('Already Connected', `You are already connected to the best available network: ${current}`);
        }
        break;
      }
      
      if (!foundNetwork) {
        this.alertService.close();
        await this.alertService.showWarning('No Known Networks', 'No known networks found in the area.');
      }
    } catch (error) {
      this.alertService.close();
      await this.alertService.showError('Auto Switch Failed', 'Failed to automatically switch networks. Please try manual connection.');
      throw error;
    }
  }

  /**
   * Get current connected SSID with error handling
   */
  async getCurrentSSID(): Promise<string | null> {
    try {
      return await this.wifi.getConnectedSSID();
    } catch (error) {
      console.warn('Failed to get current SSID:', error);
      return null;
    }
  }

  /**
   * Disconnect from current network
   */
  async disconnect(): Promise<void> {
    try {
      this.alertService.showLoading('Disconnecting...');
      
      // Get current SSID first
      const currentSSID = await this.getCurrentSSID();
      if (!currentSSID) {
        this.alertService.close();
        await this.alertService.showWarning('Not Connected', 'You are not currently connected to any WiFi network.');
        return;
      }
      
      await this.wifi.disconnect(currentSSID);
      this.alertService.close();
      await this.alertService.showSuccess('Disconnected', `Successfully disconnected from ${currentSSID}.`);
    } catch (error) {
      this.alertService.close();
      await this.alertService.showError('Disconnect Failed', 'Failed to disconnect from network.');
      throw error;
    }
  }
}