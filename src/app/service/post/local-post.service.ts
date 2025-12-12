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
            map(content => {
                const markdown = frontMatter<Post>(content);
                const metadata = markdown.attributes;

                Object.defineProperty(metadata, 'content', {
                    enumerable: true,
                    value: markdown.body
                });
                Object.defineProperty(metadata.thumbnail, 'fullPath', {
                    enumerable: true,
                    value: metadata.thumbnail.folderPath + '/' + metadata.thumbnail.fileName
                });

                return metadata;
            })
        );
    }

}