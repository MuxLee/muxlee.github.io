import { HttpClient } from '@angular/common/http';

import { type Observable } from 'rxjs';

import { type Post } from '@model/post';
import { GlobalPostService } from '@service/post/global-post.service';
import { LocalPostService } from '@service/post/local-post.service';
import { registerService } from '@service/service.provider';

export default abstract class PostService<T> {

    abstract getPost(postIdentity: string): Observable<T>;

}

registerService<PostService<Post>>({
    environment: 'global',
    token: PostService,
    useClass: GlobalPostService
});
registerService<PostService<string>>({
    deps: [HttpClient],
    environment: 'local',
    token: PostService,
    useClass: LocalPostService
});