import { Component } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  isSending = false;
  submitStatus: 'success' | 'error' | null = null;

  onSubmit() {
    if (this.isSending) return;

    this.isSending = true;
    this.submitStatus = null;

    // Sostituisci questi valori con i tuoi di EmailJS
    const serviceID = 'service_r3ra8n2';
    const templateID = 'template_q9uvika';
    const publicKey = '3Ypls9oEIkHR_e7zO';

    emailjs.send(serviceID, templateID, this.formData, publicKey)
      .then((result: EmailJSResponseStatus) => {
        console.log('Email inviata con successo!', result.text);
        this.submitStatus = 'success';
        this.resetForm();
      }, (error) => {
        console.error('Errore durante l\'invio:', error.text);
        this.submitStatus = 'error';
      })
      .finally(() => {
        this.isSending = false;
      });
  }

  private resetForm() {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
  }
}
