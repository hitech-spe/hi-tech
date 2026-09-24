import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { LoadingService } from "../../services/loading.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoginMode = true;
  error = '';
  success = '';
  isLoading = false;

  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.success = '';
    this.password = '';
    this.confirmPassword = '';
  }

  isFormValid(): boolean {
    if (!this.email || !this.email.includes('@') || !this.password || this.password.length < 6) {
      return false;
    }
    if (!this.isLoginMode) {
      if (!this.firstName.trim() || !this.lastName.trim() || this.password !== this.confirmPassword) {
        return false;
      }
    }
    return true;
  }

  async onSubmit() {
    if (this.isLoading) return;

    if (!this.email || !this.email.trim()) {
      this.error = 'AUTH.ERROR_REQUIRED_FIELDS';
      return;
    }

    if (!this.password || this.password.length < 6) {
      this.error = 'AUTH.ERROR_PASSWORD_SHORT';
      return;
    }

    if (!this.isLoginMode) {
      if (!this.firstName.trim() || !this.lastName.trim()) {
        this.error = 'AUTH.ERROR_REQUIRED_FIELDS';
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.error = 'AUTH.ERROR_MATCH';
        return;
      }
    }

    this.error = '';
    this.success = '';
    this.isLoading = true;
    this.loadingService.show();

    try {
      if (this.isLoginMode) {
        await this.authService.login(this.email.trim(), this.password);
        // Reindirizza all'area riservata /quotes come destinazione naturale
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/quotes';
        await this.router.navigateByUrl(returnUrl);
      } else {
        await this.authService.register(
          this.email.trim(),
          this.password,
          this.firstName.trim(),
          this.lastName.trim()
        );
        this.success = 'AUTH.SUCCESS_REGISTER';
        this.isLoginMode = true;
        this.password = '';
        this.confirmPassword = '';
      }
    } catch (err: any) {
      console.error('Errore autenticazione:', err);
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        this.error = 'AUTH.ERROR_INVALID_CREDENTIALS';
      } else if (code === 'auth/email-already-in-use') {
        this.error = 'AUTH.ERROR_EMAIL_IN_USE';
      } else if (code === 'auth/invalid-email') {
        this.error = 'AUTH.ERROR_INVALID_EMAIL';
      } else {
        this.error = err.message || 'AUTH.ERROR_GENERIC';
      }
    } finally {
      this.isLoading = false;
      this.loadingService.hide();
    }
  }
}
