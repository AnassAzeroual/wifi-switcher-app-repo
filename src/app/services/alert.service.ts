import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  /**
   * Show a success alert
   */
  async showSuccess(title: string, message?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#28a745',
      timer: 3000,
      timerProgressBar: true
    });
  }

  /**
   * Show an error alert
   */
  async showError(title: string, message?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33'
    });
  }

  /**
   * Show a warning alert
   */
  async showWarning(title: string, message?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#ffc107'
    });
  }

  /**
   * Show an info alert
   */
  async showInfo(title: string, message?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text: message,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#17a2b8'
    });
  }

  /**
   * Show a confirmation dialog
   */
  async showConfirmation(
    title: string, 
    message?: string,
    confirmText: string = 'Yes',
    cancelText: string = 'No'
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d'
    });
  }

  /**
   * Show a loading alert
   */
  showLoading(title: string = 'Loading...', message?: string): void {
    Swal.fire({
      title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Close any open alert
   */
  close(): void {
    Swal.close();
  }

  /**
   * Show a toast notification
   */
  async showToast(
    message: string, 
    icon: SweetAlertIcon = 'success',
    position: 'top' | 'top-end' | 'top-start' | 'center' | 'center-end' | 'center-start' | 'bottom' | 'bottom-end' | 'bottom-start' = 'top-end'
  ): Promise<SweetAlertResult> {
    const Toast = Swal.mixin({
      toast: true,
      position,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    return Toast.fire({
      icon,
      title: message
    });
  }

  /**
   * Show input dialog
   */
  async showInput(
    title: string,
    inputType: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text',
    placeholder?: string,
    defaultValue?: string
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      input: inputType,
      inputPlaceholder: placeholder,
      inputValue: defaultValue,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a value';
        }
        return null;
      }
    });
  }
}
