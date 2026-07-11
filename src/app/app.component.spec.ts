import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { FirestoreService } from './services/firestore.service';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

describe('AppComponent', () => {
  const mockAuthService = {
    user$: of(null)
  };

  const mockFirestoreService = {
    getUserDocData: () => of(null)
  };

  const mockFirestore = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        AppComponent
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: FirestoreService, useValue: mockFirestoreService },
        { provide: Firestore, useValue: mockFirestore }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'hi-tech'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('hi-tech');
  });
});
