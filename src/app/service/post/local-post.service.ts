import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import PostService from '@service/post/post.service';
import { Comprehensive } from '@model/comprehensive';

export class LocalPostService implements PostService {

    constructor(private httpClient: HttpClient) {}

    getMetadata(): Observable<Comprehensive> {
        return this.httpClient.get<Comprehensive>('/comprehensive.json');
    }

}
