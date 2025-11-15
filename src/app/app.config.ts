import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from '@app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideService } from '@service/service.provider';

export const appConfig: ApplicationConfig = {
    providers: [
        provideClientHydration(withEventReplay()),
        provideHttpClient(),
        provideRouter(routes, withComponentInputBinding()),
        provideService(),
        provideZoneChangeDetection({
            eventCoalescing: true
        })
    ]
};
