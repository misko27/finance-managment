import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideIonicAngular,
  IonicRouteStrategy,
} from '@ionic/angular/standalone';
import { RouteReuseStrategy } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { IonicGestureConfig } from './ioniq-gesture-config';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    provideRouter(routes),
    provideIonicAngular({
      // Pridanie passive vlastností pre Ionic
      swipeBackEnabled: false, // Voliteľné: vypnutie swipe-back gestu pre lepší výkon
      // Zvýšenie reakčného času pre lepšiu plynulosť
      backButtonDefaultHref: '/',
    }),
    provideHttpClient(),
    {
      provide: Storage,
      useFactory: () => {
        const storage = new Storage({
          name: 'financialAppDB',
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        });
        storage.create();
        return storage;
      },
    },
  ],
};
