import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import frontMatter from 'front-matter';
import { map, Observable, tap } from 'rxjs';

import { Post } from '@model/post';
import PostService from '@service/post/post.service';

export class LocalPostService implements PostService {

    private httpClient = inject(HttpClient);

    getPost(postFilePath: string): Observable<Post> {
        postFilePath = atob(postFilePath);
        postFilePath = postFilePath.replace(/public\//, '');

        return this.httpClient.get(`/${postFilePath}`, {
            responseType: 'text'
        }).pipe(
            map(markdown => {
                const metadata = frontMatter<Post>(markdown).attributes;

                Object.defineProperty(metadata, 'content', {
                    enumerable: true,
                    value: markdown
                });

                return metadata;
            })
        );
    }

}