import { Component } from '@angular/core';
import { IonButton, IonContent, IonItem, IonList } from "@ionic/angular/standalone";
import { WifiNetwork, WifiService } from './services/wifi.service';

@Component({
  selector: 'app-root',
  imports: [IonItem, IonButton, IonList, IonContent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'wifi-switcher';
  networks: WifiNetwork[] = [];
  // Define your previously authorized networks here
  known = [
    { ssid: 'HomeWiFi', password: 'home1234' },
    { ssid: 'OfficeWiFi', password: 'office5678' }
  ];

  constructor(private readonly wifi: WifiService) { }

  async start() {
    // Loop every 30 seconds (or choose interval)
    setInterval(async () => {
      await this.wifi.scan()
        .then(list => this.networks = this.wifi.sortByStrength(list));
      await this.wifi.autoSwitch(this.known);
    }, 5000);
  }

}
