import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import PostService from '@service/post/post.service';

export class LocalPostService implements PostService<string> {

    private httpClient: HttpClient = inject(HttpClient);

    getPost(postFilePath: string): Observable<string> {
        postFilePath = postFilePath.replace(/public\//, '');

        return this.httpClient.get(`/${postFilePath}`, {
            responseType: 'text'
        });
    }

}
