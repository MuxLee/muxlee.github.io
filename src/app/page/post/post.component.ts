import { Component, inject, input, OnInit } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { LayoutComponent } from '@component/layout/layout.component';
import PostService from '@service/post/post.service';

@Component({
    imports: [LayoutComponent],
    selector: 'post',
    styleUrl: './post.component.css',
    templateUrl: './post.component.html'
})
export class PostComponent implements OnInit {

    protected postId = input.required<string>();
    private postService = inject(PostService);

    async ngOnInit(): Promise<void> {
        const post = await firstValueFrom(this.postService.getPost(this.postId()));
    }

}