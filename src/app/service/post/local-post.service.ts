import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { type Post } from '@model/post';
import PostService from '@service/post/post.service';

export class LocalPostService implements PostService {

    private httpClient: HttpClient = inject(HttpClient);

    getPost(postFilePath: string): Observable<Post> {
        postFilePath = postFilePath.replace(/public\//, '');

        return this.httpClient.get<Post>(`/${postFilePath}`);
    }

}
