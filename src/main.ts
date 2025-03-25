import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { registerIcons } from './app/icons-registry';

// Nastavenie passive event listeners
(window as any).__zone_symbol__PASSIVE_EVENTS = [
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',
  'wheel',
];

// Registrácia ikon
registerIcons();

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
