import { TestBed } from '@angular/core/testing';

import { GlobalPostService } from './global-post.service';

describe('GlobalPostService', () => {
    let service: GlobalPostService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GlobalPostService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});