import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { type Comprehensive } from '@model/comprehensive';
import ComprehensiveService from '@service/comprehensive/comprehensive.service';

export class LocalComprehensiveService implements ComprehensiveService {

    private httpClient: HttpClient = inject(HttpClient);

    getComprehensive(): Observable<Comprehensive> {
        return this.httpClient.get<Comprehensive>('/comprehensive.json');
    }
    
}