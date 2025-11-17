import { HttpClient } from '@angular/common/http';

import { type Observable } from 'rxjs';

import { type Post } from '@model/post';
import { GlobalPostService } from '@service/post/global-post.service';
import { LocalPostService } from '@service/post/local-post.service';
import { registerService } from '@service/service.provider';

export default abstract class PostService {

    getPost(postIdentity: string): Observable<Post> {
        throw new Error(`'getPost' 메소드가 구현되지 않았습니다.`);
    };

}

registerService<PostService>({
    environment: 'global',
    token: PostService,
    useClass: GlobalPostService
});
registerService<PostService>({
    environment: 'local',
    token: PostService,
    useClass: LocalPostService,
    deps: [HttpClient]
});