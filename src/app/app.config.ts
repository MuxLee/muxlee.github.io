import { HttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';

import { routes } from '@app/app.routes';
import { provideService } from '@service/service.provider';

export const appConfig: ApplicationConfig = {
    providers: [
        provideClientHydration(withEventReplay()),
        provideHttpClient(),
        provideMarkdown({
            loader: HttpClient
        }),
        provideRouter(routes, withComponentInputBinding()),
        provideService(),
        provideZoneChangeDetection({
            eventCoalescing: true
        })
    ]
};