import { ErrorHandler, Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() { }

  handleError(error: any): void {
    console.error('Global error caught:', error);
    
    // Extract meaningful error message
    let errorMessage = 'An unexpected error occurred';
    let errorTitle = 'Error';
    
    if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Categorize error types
    if (error?.name === 'ChunkLoadError') {
      errorTitle = 'Loading Error';
      errorMessage = 'Failed to load application resources. Please refresh the page.';
    } else if (error?.status === 0) {
      errorTitle = 'Network Error';
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else if (error?.status >= 400 && error?.status < 500) {
      errorTitle = 'Client Error';
      errorMessage = `Request failed: ${errorMessage}`;
    } else if (error?.status >= 500) {
      errorTitle = 'Server Error';
      errorMessage = 'Server error occurred. Please try again later.';
    }

    // Show SweetAlert2 error dialog
    Swal.fire({
      title: errorTitle,
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      backdrop: true,
      allowOutsideClick: false,
      customClass: {
        container: 'error-alert-container',
        popup: 'error-alert-popup',
        title: 'error-alert-title',
        htmlContainer: 'error-alert-content'
      }
    }).then(() => {
      // Optional: Add recovery actions
      if (error?.name === 'ChunkLoadError') {
        // Offer to reload the page for chunk load errors
        Swal.fire({
          title: 'Reload Page?',
          text: 'Would you like to reload the page to fix this issue?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Reload',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#3085d6'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    });
  }
}
