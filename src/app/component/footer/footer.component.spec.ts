import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSemantic } from './footer.component';

describe('FooterComponent', () => {
    let component: FooterSemantic;
    let fixture: ComponentFixture<FooterSemantic>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterSemantic]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FooterSemantic);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
