import { TestBed } from '@angular/core/testing';

import { LocalPostService } from './local-post.service';

describe('LocalPostService', () => {
    let service: LocalPostService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LocalPostService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});