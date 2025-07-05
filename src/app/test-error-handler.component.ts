import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AlertService } from './services/alert.service';
import { WifiService } from './services/wifi.service';

@Component({
  selector: 'app-test-error-handler',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Error Handler & Alert Test</ion-card-title>
          <ion-card-subtitle>Test global error handling and SweetAlert2 integration</ion-card-subtitle>
        </ion-card-header>
        
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-md="6">
                <ion-button expand="block" fill="solid" color="primary" (click)="testSuccess()">
                  <ion-icon name="checkmark-circle" slot="start"></ion-icon>
                  Test Success Alert
                </ion-button>
              </ion-col>
              
              <ion-col size="12" size-md="6">
                <ion-button expand="block" fill="solid" color="danger" (click)="testError()">
                  <ion-icon name="alert-circle" slot="start"></ion-icon>
                  Test Error Alert
                </ion-button>
              </ion-col>
            </ion-row>
            
            <ion-row>
              <ion-col size="12" size-md="6">
                <ion-button expand="block" fill="solid" color="warning" (click)="testWarning()">
                  <ion-icon name="warning" slot="start"></ion-icon>
                  Test Warning Alert
                </ion-button>
              </ion-col>
              
              <ion-col size="12" size-md="6">
                <ion-button expand="block" fill="solid" color="tertiary" (click)="testInfo()">
                  <ion-icon name="information-circle" slot="start"></ion-icon>
                  Test Info Alert
                </ion-button>
              </ion-col>
            </ion-row>
            
            <ion-row>
              <ion-col size="12" size-md="6">
                <ion-button expand="block" fill="outline" color="medium" (click)="testConfirmation()">
                  <ion-icon name="help-circle" slot="start"></ion-icon>
                  Test Confirmation
                </ion-button>
              </ion-col>
              
              <ion-col size="12" size-md="6">
                <ion-button expand="block" fill="outline" color="medium" (click)="testToast()">
                  <ion-icon name="notifications" slot="start"></ion-icon>
                  Test Toast
                </ion-button>
              </ion-col>
            </ion-row>
            
            <ion-row>
              <ion-col size="12" size-md="6">
                <ion-button expand="block" fill="outline" color="medium" (click)="testInput()">
                  <ion-icon name="create" slot="start"></ion-icon>
                  Test Input Dialog
                </ion-button>
              </ion-col>
              
              <ion-col size="12" size-md="6">
                <ion-button expand="block" fill="outline" color="medium" (click)="testLoading()">
                  <ion-icon name="hourglass" slot="start"></ion-icon>
                  Test Loading
                </ion-button>
              </ion-col>
            </ion-row>
            
            <ion-row>
              <ion-col size="12">
                <ion-button expand="block" fill="solid" color="danger" (click)="triggerGlobalError()">
                  <ion-icon name="bug" slot="start"></ion-icon>
                  Trigger Global Error Handler
                </ion-button>
              </ion-col>
            </ion-row>
            
            <ion-row>
              <ion-col size="12">
                <ion-button expand="block" fill="solid" color="secondary" (click)="testWifiScan()">
                  <ion-icon name="wifi" slot="start"></ion-icon>
                  Test WiFi Scan (with error handling)
                </ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})
export class TestErrorHandlerComponent {
  private alertService = inject(AlertService);
  private wifiService = inject(WifiService);

  async testSuccess() {
    await this.alertService.showSuccess('Success!', 'This is a success message.');
  }

  async testError() {
    await this.alertService.showError('Error!', 'This is an error message.');
  }

  async testWarning() {
    await this.alertService.showWarning('Warning!', 'This is a warning message.');
  }

  async testInfo() {
    await this.alertService.showInfo('Information', 'This is an information message.');
  }

  async testConfirmation() {
    const result = await this.alertService.showConfirmation(
      'Are you sure?',
      'This action cannot be undone.',
      'Yes, do it!',
      'Cancel'
    );
    
    if (result.isConfirmed) {
      await this.alertService.showSuccess('Confirmed!', 'Action was confirmed.');
    } else {
      await this.alertService.showInfo('Cancelled', 'Action was cancelled.');
    }
  }

  async testToast() {
    await this.alertService.showToast('This is a toast notification!', 'success', 'top-end');
  }

  async testInput() {
    const result = await this.alertService.showInput(
      'Enter your name',
      'text',
      'Your name here...'
    );
    
    if (result.isConfirmed && result.value) {
      await this.alertService.showSuccess('Hello!', `Nice to meet you, ${result.value}!`);
    }
  }

  async testLoading() {
    this.alertService.showLoading('Loading...', 'Please wait while we process your request.');
    
    // Simulate some work
    setTimeout(() => {
      this.alertService.close();
      this.alertService.showSuccess('Done!', 'Loading completed successfully.');
    }, 3000);
  }

  triggerGlobalError() {
    // This will trigger the global error handler
    throw new Error('This is a test error to demonstrate global error handling!');
  }

  async testWifiScan() {
    try {
      // This will show loading dialogs and success/error messages automatically
      const networks = await this.wifiService.scan();
      console.log('Found networks:', networks);
      
      if (networks.length > 0) {
        await this.alertService.showInfo(
          'Networks Found', 
          `Found ${networks.length} WiFi networks. Check the console for details.`
        );
      }
    } catch (error) {
      // Error is already handled by the WifiService, but we can add additional logic here if needed
      console.error('Scan failed:', error);
    }
  }
}
