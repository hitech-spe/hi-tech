import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { LoadingService } from "../../services/loading.service";
import { TranslateModule } from "@ngx-translate/core";
import { form, FormField, FormRoot, required, email, minLength, validate } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormField, FormRoot, TranslateModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);

  isLoginMode = true;
  error = '';
  success = '';
  isLoading = false;

  // Signal-based credentials (the single source of truth)
  protected readonly credentials = signal({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  // Signal Form definition with schema validations
  protected readonly loginForm = form(
    this.credentials,
    (f) => {
      required(f.email, { message: 'AUTH.ERROR_REQUIRED_FIELDS' });
      email(f.email, { message: 'AUTH.ERROR_INVALID_EMAIL' });

      required(f.password, { message: 'AUTH.ERROR_REQUIRED_FIELDS' });
      minLength(f.password, 6, { message: 'AUTH.ERROR_PASSWORD_SHORT' });

      validate(f.firstName, (ctx) => {
        if (!this.isLoginMode && !ctx.value().trim()) {
          return { kind: 'required', message: 'AUTH.ERROR_REQUIRED_FIELDS' };
        }
        return null;
      });

      validate(f.lastName, (ctx) => {
        if (!this.isLoginMode && !ctx.value().trim()) {
          return { kind: 'required', message: 'AUTH.ERROR_REQUIRED_FIELDS' };
        }
        return null;
      });

      validate(f.confirmPassword, (ctx) => {
        if (!this.isLoginMode) {
          if (!ctx.value().trim()) {
            return { kind: 'required', message: 'AUTH.ERROR_REQUIRED_FIELDS' };
          }
          if (ctx.value() !== this.credentials().password) {
            return { kind: 'mismatch', message: 'AUTH.ERROR_MATCH' };
          }
        }
        return null;
      });
    }
  );

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.success = '';
    
    this.credentials.set({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
    
    this.loginForm().reset();
  }

  async onSubmit() {
    if (this.isLoading) return;
    this.error = '';
    this.success = '';

    this.isLoading = true;
    this.loadingService.show();

    const data = this.credentials();

    try {
      if (this.isLoginMode) {
        await this.authService.login(data.email, data.password);
        await this.router.navigate(['/home']);
      } else {
        await this.authService.register(data.email, data.password, data.firstName, data.lastName);
        this.success = 'AUTH.SUCCESS_REGISTER';
        this.isLoginMode = true;
        this.credentials.set({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: ''
        });
        this.loginForm().reset();
      }
    } catch (err: any) {
      console.error(err);
      this.error = err.message || 'AUTH.ERROR_GENERIC';
    } finally {
      this.isLoading = false;
      this.loadingService.hide();
    }
  }
}
