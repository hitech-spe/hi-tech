// Polyfill per evitare ExperimentalWarning di Node 22 su localStorage durante SSR e prerender
if (typeof globalThis !== 'undefined') {
  try {
    const memoryStorage = new Map<string, string>();
    const mockStorage = {
      getItem: (key: string): string | null => memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string): void => { memoryStorage.set(key, String(value)); },
      removeItem: (key: string): void => { memoryStorage.delete(key); },
      clear: (): void => { memoryStorage.clear(); },
      get length(): number { return memoryStorage.size; },
      key: (index: number): string | null => Array.from(memoryStorage.keys())[index] ?? null
    };

    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
      enumerable: true
    });
  } catch {
    // Fallback silenzioso
  }
}

import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(AppComponent, config, context);

export default bootstrap;
