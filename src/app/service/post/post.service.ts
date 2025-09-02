import { Observable } from 'rxjs';
import { Comprehensive } from '@model/comprehensive';
import { registerService } from '@service/service.provider';
import { GlobalPostService } from '@service/post/global-post.service';
import { LocalPostService } from '@service/post/local-post.service';
import { HttpClient } from '@angular/common/http';

abstract class PostService {

    getMetadata(): Observable<Comprehensive> {
        throw new Error('Method not implemented.');
    };

}

registerService<PostService>({
    environment: 'global',
    token: PostService,
    useClass: GlobalPostService,
    deps: [HttpClient]
});
registerService<PostService>({
    environment: 'local',
    token: PostService,
    useClass: LocalPostService,
    deps: [HttpClient]
})

export default PostService;
