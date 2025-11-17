
import { Observable } from 'rxjs';

import { type Comprehensive } from '@model/comprehensive';
import ComprehensiveService from '@service/comprehensive/comprehensive.service';

export class GlobalComprehensiveService implements ComprehensiveService {

    getComprehensive(): Observable<Comprehensive> {
        return new Observable(() => {});
    }
    
}