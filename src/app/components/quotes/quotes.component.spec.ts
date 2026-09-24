import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { QuotesComponent } from './quotes.component';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('QuotesComponent', () => {
  let component: QuotesComponent;
  let fixture: any;

  const mockAuthService = {
    user$: of({ uid: 'test-admin-123', email: 'admin@hitech.com' })
  };

  const mockFirestoreService = {
    getClientsByUser: vi.fn().mockReturnValue(of([
      { id: 'client-1', userId: 'test-admin-123', name: 'Mario Rossi', company: 'Masseria Semeraro', email: 'mario@test.com', phone: '+393401234567' }
    ])),
    getQuotesByUser: vi.fn().mockReturnValue(of([])),
    addClient: vi.fn().mockResolvedValue({ id: 'new-client-id' }),
    updateClient: vi.fn().mockResolvedValue(true),
    deleteClient: vi.fn().mockResolvedValue(true),
    saveQuote: vi.fn().mockResolvedValue({ id: 'new-quote-id' }),
    updateQuote: vi.fn().mockResolvedValue(true),
    deleteQuote: vi.fn().mockResolvedValue(true),
    getMaintenanceContracts: vi.fn().mockReturnValue(of([])),
    saveMaintenanceContract: vi.fn().mockResolvedValue({ id: 'new-contract-id' }),
    updateMaintenanceContract: vi.fn().mockResolvedValue(true),
    deleteMaintenanceContract: vi.fn().mockResolvedValue(true),
    getAdminAlertSettings: vi.fn().mockReturnValue(of(null)),
    saveAdminAlertSettings: vi.fn().mockResolvedValue(true)
  };

  const mockLoadingService = {
    show: vi.fn(),
    hide: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotesComponent, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: FirestoreService, useValue: mockFirestoreService },
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the QuotesComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default work type PIATTAFORMA_GESTIONALE template', () => {
    expect(component.quote.workType).toBe('PIATTAFORMA_GESTIONALE');
    expect(component.quote.modules.length).toBeGreaterThanOrEqual(4);
    expect(component.quote.phases.length).toBeGreaterThanOrEqual(4);
    expect(component.quote.priceNet).toBe(4900);
    expect(component.quote.taxRate).toBe(22);
  });

  it('should correctly calculate tax and total gross amounts', () => {
    component.quote.priceNet = 5000;
    component.quote.taxRate = 22;

    expect(component.getTaxAmount()).toBe(1100);
    expect(component.getTotalGross()).toBe(6100);
    expect(component.getMilestoneAmount(30)).toBe(1500);
    expect(component.getMilestoneAmount(40)).toBe(2000);
  });

  it('should allow adding and removing functional modules', () => {
    const initialCount = component.quote.modules.length;
    component.addModule();
    expect(component.quote.modules.length).toBe(initialCount + 1);

    component.removeModule(component.quote.modules.length - 1);
    expect(component.quote.modules.length).toBe(initialCount);
  });

  it('should select an existing client and fill form details', () => {
    component.onClientSelect({ target: { value: 'client-1' } });
    expect(component.client.name).toBe('Mario Rossi');
    expect(component.client.company).toBe('Masseria Semeraro');
  });

  // --- Test Modulo Canoni & Manutenzioni ---

  it('should initialize contract with 500 annual price and 250 semestral fee', () => {
    const contract = component.contractForm;
    expect(contract.annualPrice).toBe(500);
    expect(contract.periodPrice).toBe(250);
    expect(contract.billingFrequency).toBe('SEMESTRAL');
  });

  it('should recalculate period price when annual price or frequency changes', () => {
    component.contractForm.annualPrice = 600;
    component.onContractAnnualPriceChange();
    expect(component.contractForm.periodPrice).toBe(300);

    component.contractForm.billingFrequency = 'ANNUAL';
    component.onContractFrequencyChange();
    expect(component.contractForm.periodPrice).toBe(600);
  });

  it('should calculate days remaining correctly', () => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 5);

    const futureIso = futureDate.toISOString().split('T')[0];
    expect(component.getDaysRemaining(futureIso)).toBe(5);
  });

  it('should calculate next due date 6 months ahead for SEMESTRAL', () => {
    const fromDate = '2026-04-15';
    const nextDue = component['alertService'].calculateNextDueDate(fromDate, 'SEMESTRAL');
    expect(nextDue).toBe('2026-10-15');
  });

  it('should format WhatsApp alert message with client, service, and quota details', () => {
    const sampleContract = {
      ...component.contractForm,
      client: {
        name: 'Mario Rossi',
        company: 'Masseria Semeraro',
        email: 'mario@test.com',
        phone: '+393401234567'
      },
      serviceName: 'Manutenzione Piattaforma Semeraro',
      annualPrice: 500,
      periodPrice: 250,
      nextDueDate: '2026-10-15'
    };

    const message = component['alertService'].formatAlertMessage(sampleContract, 5);
    expect(message).toContain('Masseria Semeraro');
    expect(message).toContain('250,00');
    expect(message).toContain('500,00');
    expect(message).toContain('5 giorni');
  });
});
