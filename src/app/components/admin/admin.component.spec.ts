import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AdminComponent } from './admin.component';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: any;

  const mockAuthService = {
    user$: of({ uid: 'test-admin-123', email: 'admin@hitech.com', displayName: 'Admin HiTech' }),
    logout: vi.fn().mockResolvedValue(undefined)
  };

  const mockFirestoreService = {
    getClients: vi.fn().mockReturnValue(of([
      { id: 'client-1', userId: 'test-admin-123', name: 'Mario Rossi', company: 'Masseria Semeraro', email: 'mario@test.com', phone: '+393401234567' }
    ])),
    getClientsByUser: vi.fn().mockReturnValue(of([
      { id: 'client-1', userId: 'test-admin-123', name: 'Mario Rossi', company: 'Masseria Semeraro', email: 'mario@test.com', phone: '+393401234567' }
    ])),
    getQuotes: vi.fn().mockReturnValue(of([
      { id: 'quote-1', subject: 'Piattaforma Web B2B', priceNet: 5000, client: { name: 'Mario Rossi' }, status: 'accepted' }
    ])),
    getQuotesByUser: vi.fn().mockReturnValue(of([])),
    addClient: vi.fn().mockResolvedValue({ id: 'new-client-id' }),
    updateClient: vi.fn().mockResolvedValue(true),
    deleteClient: vi.fn().mockResolvedValue(true),
    saveQuote: vi.fn().mockResolvedValue({ id: 'new-quote-id' }),
    updateQuote: vi.fn().mockResolvedValue(true),
    deleteQuote: vi.fn().mockResolvedValue(true),
    getMaintenanceContracts: vi.fn().mockReturnValue(of([
      {
        id: 'contract-1',
        serviceName: 'Manutenzione Cloud',
        annualPrice: 600,
        periodPrice: 300,
        billingFrequency: 'SEMESTRAL',
        nextDueDate: '2026-10-20',
        client: { name: 'Mario Rossi', company: 'Masseria Semeraro' }
      }
    ])),
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
      imports: [AdminComponent, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: FirestoreService, useValue: mockFirestoreService },
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AdminComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should compute user initials accurately', () => {
    expect(component.getUserInitials()).toBe('AH');
  });

  it('should load all quotes, clients, and contracts on initialization without restricting to single user', () => {
    expect(mockFirestoreService.getQuotes).toHaveBeenCalled();
    expect(mockFirestoreService.getClients).toHaveBeenCalled();
    expect(mockFirestoreService.getMaintenanceContracts).toHaveBeenCalled();
    expect(component.contracts.length).toBe(1);
    expect(component.clients.length).toBe(1);
    expect(component.quotes.length).toBe(1);
  });

  it('should calculate annual recurring revenue (ARR) correctly', () => {
    expect(component.totalAnnualRecurringRevenue).toBe(600);
  });

  it('should switch tabs between quotes, maintenance, and clients', () => {
    expect(component.currentTab).toBe('quotes');
    component.currentTab = 'maintenance';
    expect(component.currentTab).toBe('maintenance');
    component.currentTab = 'clients';
    expect(component.currentTab).toBe('clients');
  });

  it('should allow filtering clients in client address book', () => {
    component.clientSearchTerm = 'Semeraro';
    expect(component.filteredClientsList.length).toBe(1);
    component.clientSearchTerm = 'NonEsiste';
    expect(component.filteredClientsList.length).toBe(0);
  });

  it('should initialize quote with default values and calculate gross totals', () => {
    component.quote.priceNet = 4000;
    component.quote.taxRate = 22;
    expect(component.getTaxAmount()).toBe(880);
    expect(component.getTotalGross()).toBe(4880);
  });

  it('should recalculate period price on annual price change for semestral frequency', () => {
    component.contractForm.billingFrequency = 'SEMESTRAL';
    component.contractForm.annualPrice = 1000;
    component.onContractAnnualPriceChange();
    expect(component.contractForm.periodPrice).toBe(500);
  });
});
