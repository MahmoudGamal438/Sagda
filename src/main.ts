import { bootstrapApplication } from '@angular/platform-browser';
import { isDevMode } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if (isDevMode() && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      void registration.unregister();
    }
  });
  if (typeof caches !== 'undefined') {
    void caches.keys().then((keys) => keys.forEach((key) => void caches.delete(key)));
  }
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
