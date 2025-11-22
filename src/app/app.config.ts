import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection, SecurityContext } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { gfmHeadingId } from 'marked-gfm-heading-id';
import { MARKED_EXTENSIONS, MARKED_OPTIONS, provideMarkdown, SANITIZE } from 'ngx-markdown';

import { routes } from '@app/app.routes';
import { provideService } from '@service/service.provider';

export const appConfig: ApplicationConfig = {
    providers: [
        provideClientHydration(withEventReplay()),
        provideHttpClient(),
        provideMarkdown({
            loader: HttpClient,
            markedExtensions: [
                {
                    provide: MARKED_EXTENSIONS,
                    useFactory: gfmHeadingId,
                    multi: true
                }
            ],
            markedOptions: {
                provide: MARKED_OPTIONS,
                useValue: {
                    breaks: true,
                    gfm: true,
                    pedantic: false,
                }
            },
            sanitize: {
                provide: SANITIZE,
                useValue: SecurityContext.NONE
            }
        }),
        provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
        provideService(),
        provideZoneChangeDetection({
            eventCoalescing: true
        })
    ]
};