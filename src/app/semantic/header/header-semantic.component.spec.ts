import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSemantic } from './header-semantic.component';

describe('HeaderComponent', () => {
    let component: HeaderSemantic;
    let fixture: ComponentFixture<HeaderSemantic>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderSemantic]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderSemantic);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
