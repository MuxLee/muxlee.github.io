import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Comprehensive } from '@model/comprehensive';
import PostService from '@service/post/post.service';

export class GlobalPostService implements PostService {

    constructor(private httpClient: HttpClient) {}

    getMetadata(): Observable<Comprehensive> {
        return new Observable(() => {})
    }

}
