import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: any;
  let router: Router;

  const mockAuthService = {
    login: vi.fn().mockResolvedValue({ user: { uid: '123' } }),
    register: vi.fn().mockResolvedValue({ user: { uid: '123' } })
  };

  const mockLoadingService = {
    show: vi.fn(),
    hide: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle between login and register modes', () => {
    expect(component.isLoginMode).toBe(true);
    component.toggleMode();
    expect(component.isLoginMode).toBe(false);
    component.toggleMode();
    expect(component.isLoginMode).toBe(true);
  });

  it('should block submit when email is missing or password is too short', async () => {
    component.email = '';
    component.password = '123';
    await component.onSubmit();

    expect(component.error).toBe('AUTH.ERROR_REQUIRED_FIELDS');
    expect(mockAuthService.login).not.toHaveBeenCalled();

    component.email = 'test@hitech.com';
    component.password = '123';
    await component.onSubmit();

    expect(component.error).toBe('AUTH.ERROR_PASSWORD_SHORT');
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should execute login and navigate to returnUrl or /quotes', async () => {
    component.email = 'admin@hitech.com';
    component.password = 'secretPassword123';

    await component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('admin@hitech.com', 'secretPassword123');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/quotes');
  });

  it('should execute register when in registration mode', async () => {
    component.isLoginMode = false;
    component.firstName = 'Leonardo';
    component.lastName = 'Rossi';
    component.email = 'leo@hitech.com';
    component.password = 'secretPassword123';
    component.confirmPassword = 'secretPassword123';

    await component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith(
      'leo@hitech.com',
      'secretPassword123',
      'Leonardo',
      'Rossi'
    );
    expect(component.success).toBe('AUTH.SUCCESS_REGISTER');
    expect(component.isLoginMode).toBe(true);
  });
});
