import { TestBed } from '@angular/core/testing';

import { LocalComprehensiveService } from './local-comprehensive.service';

describe('LocalComprehensiveService', () => {
    let service: LocalComprehensiveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LocalComprehensiveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});