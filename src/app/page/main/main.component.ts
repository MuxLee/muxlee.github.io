import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { BlankContentComponent } from '@component/blank-content/blank-content.component';
import { LayoutComponent } from '@component/layout/layout.component';
import { PostCardComponent, type ThumbnailDock } from '@component/post-card/post-card.component';
import { type Comprehensive } from '@model/comprehensive';
import ComprehensiveService from '@service/comprehensive/comprehensive.service';

@Component({
    selector: 'page-main',
    imports: [
        AsyncPipe,
        BlankContentComponent,
        LayoutComponent,
        PostCardComponent
    ],
    templateUrl: './main.component.html'
})
export class MainComponent {

    protected metadata$: Observable<Comprehensive>;
    private comprehensiveSerivce = inject(ComprehensiveService);

    constructor() {
        this.metadata$ = this.comprehensiveSerivce.getComprehensive();
    }

}