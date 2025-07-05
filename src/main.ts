import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import Swal from 'sweetalert2';

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  Swal.fire({
    title: 'Unexpected Error',
    text: 'An unexpected error occurred. Please try again.',
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#d33'
  });
  
  // Prevent the default browser behavior
  event.preventDefault();
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    console.error('Bootstrap error:', err);
    
    Swal.fire({
      title: 'Application Error',
      text: 'Failed to start the application. Please refresh the page.',
      icon: 'error',
      confirmButtonText: 'Reload',
      confirmButtonColor: '#d33',
      allowOutsideClick: false
    }).then(() => {
      window.location.reload();
    });
  });
