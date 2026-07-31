import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, isDevMode, PLATFORM_ID } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { routes } from './app.routes';
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import { RemoteConfig, provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { RemoteConfigTranslateLoader } from './services/remote-config-translate.loader';
import { isPlatformBrowser } from '@angular/common';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export function RemoteConfigLoaderFactory(http: HttpClient, remoteConfig: RemoteConfig, platformId: Object) {
  if (!isPlatformBrowser(platformId)) {
    return new RemoteConfigTranslateLoader(http, null as any); 
  }
  return new RemoteConfigTranslateLoader(http, remoteConfig);
}

const firebaseConfig = {
  apiKey: "AIzaSyAIsW7AhqHYlAbw2SADg-gigMzPpbNbqa0",
  authDomain: "hi-tech-7946c.firebaseapp.com",
  projectId: "hi-tech-7946c",
  storageBucket: "hi-tech-7946c.firebasestorage.app",
  messagingSenderId: "35627281412",
  appId: "1:35627281412:web:a40152793d4801102d9951",
  measurementId: "G-JG2W5K1B3G"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
    provideRemoteConfig(() => {
      if (typeof window === 'undefined') return null as any;
      const rc = getRemoteConfig();
      rc.settings.minimumFetchIntervalMillis = isDevMode() ? 0 : 43200000;
      return rc;
    }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: RemoteConfigLoaderFactory,
          deps: [HttpClient, RemoteConfig, PLATFORM_ID]
        }
      })
    )
  ]
};
