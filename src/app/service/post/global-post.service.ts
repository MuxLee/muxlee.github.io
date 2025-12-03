
import { Observable } from 'rxjs';

import { type Post } from '@model/post';
import PostService from '@service/post/post.service';

export class GlobalPostService implements PostService {

    getPost(postId: string): Observable<Post> {
        return new Observable(() => {});
    }

}