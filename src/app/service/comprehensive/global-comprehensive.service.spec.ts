import { TestBed } from '@angular/core/testing';

import { GlobalComprehensiveService } from './global-comprehensive.service';

describe('GlobalComprehensiveService', () => {
    let service: GlobalComprehensiveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GlobalComprehensiveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});