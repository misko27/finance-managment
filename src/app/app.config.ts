import { ApplicationConfig } from '@angular/core';
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

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes),
    provideIonicAngular(),
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
