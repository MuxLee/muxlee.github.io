import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { BlankContentComponent } from '@component/blank-content/blank-content.component';
import { Comprehensive } from '@model/comprehensive';
import { FooterSemantic } from '@semantic/footer/footer-semantic.component';
import { HeaderSemantic } from '@semantic/header/header-semantic.component';
import PostService from '@service/post/post.service';

@Component({
    selector: 'page-main',
    imports: [
        BlankContentComponent,
        FooterSemantic,
        HeaderSemantic
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

    metadata: Observable<Comprehensive>;

    constructor(private postService: PostService) {
        this.metadata = this.postService.getMetadata();
    }

    ngOnInit() {
        this.metadata.subscribe(metadata => {
            console.log(metadata);
        });
    }

}
