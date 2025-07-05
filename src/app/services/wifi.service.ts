import { Injectable } from '@angular/core';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2/ngx';

export interface WifiNetwork {
  ssid: string;
  bssid: string;
  level: number;    // RSSI
  frequency: number;
}

@Injectable({ providedIn: 'root' })
export class WifiService {
  constructor(private readonly wifi: WifiWizard2) {}

  /**
   * Scan for available networks and normalize results.
   */
  async scan(): Promise<WifiNetwork[]> {
    // trigger native scan
    await this.wifi.scan();
    // fetch and map to our interface
    const raw = await this.wifi.getScanResults({ numLevels: 5 });
    return raw.map((r: { SSID: any; BSSID: any; level: any; frequency: any; }) => ({
      ssid: r.SSID,
      bssid: r.BSSID,
      level: r.level,
      frequency: r.frequency
    }));
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
    // `false` means not using WEP
    await this.wifi.connect(ssid, false, password);
  }

  /**
   * Scans, picks the strongest known network, and connects if not already connected.
   */
  async autoSwitch(known: { ssid: string; password: string }[]): Promise<void> {
    const list = await this.scan();
    const sorted = this.sortByStrength(list);

    for (const net of sorted) {
      const match = known.find(n => n.ssid === net.ssid);
      if (!match) {
        continue;
      }

      const current = await this.wifi.getConnectedSSID();
      if (current !== net.ssid) {
        await this.connect(match.ssid, match.password);
      }
      break;
    }
  }
}