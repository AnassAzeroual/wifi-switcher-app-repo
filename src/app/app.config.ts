import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2/ngx';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideIonicAngular({}),
    WifiWizard2,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ]
};
