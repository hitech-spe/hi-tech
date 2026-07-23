import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { RemoteConfig, getValue, fetchAndActivate, activate } from '@angular/fire/remote-config';
import { Observable, from, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export class RemoteConfigTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private remoteConfig: RemoteConfig
  ) {}

  getTranslation(lang: string): Observable<any> {
    // 1. Load the local static JSON translation file
    const local$ = this.http.get(`/assets/i18n/${lang}.json`).pipe(
      catchError((err) => {
        console.error(`Could not load local static translation file for ${lang}:`, err);
        return [{}];
      })
    );

    // 2. Load cached Remote Config values (non-blocking) and trigger background fetch
    const remote$ = from(
      activate(this.remoteConfig)
        .then(() => {
          const value = getValue(this.remoteConfig, `i18n_${lang}`).asString();
          if (value && value.trim()) {
            try {
              return JSON.parse(value);
            } catch (e) {
              console.error(`Error parsing cached Remote Config JSON for i18n_${lang}:`, e);
            }
          }
          return {};
        })
        .then((cachedJson) => {
          // Trigger fetch in background to get updates for subsequent sessions/pages
          fetchAndActivate(this.remoteConfig)
            .then((updated) => {
              if (updated) {
                console.log(`Remote Config updated in background for ${lang}`);
              }
            })
            .catch((err) => {
              console.warn(`Background Remote Config fetch failed:`, err);
            });
          return cachedJson;
        })
        .catch((err) => {
          console.warn(`Error activating local Remote Config for ${lang}:`, err);
          return {};
        })
    ).pipe(
      catchError(() => [{}])
    );

    // 3. Perform a deep merge, giving priority to the Remote Config values (or cached ones)
    return forkJoin([local$, remote$]).pipe(
      map(([localJson, remoteJson]) => {
        return this.deepMerge(localJson, remoteJson);
      })
    );
  }

  /**
   * Helper function to recursively merge two objects.
   * Properties in the source object (Remote Config) will overwrite those in the target object (local).
   */
  private deepMerge(target: any, source: any): any {
    if (!target) return source;
    if (!source) return target;

    const output = { ...target };
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  private isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}
