import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { type Comprehensive } from '@model/comprehensive';
import { GlobalComprehensiveService } from '@service/comprehensive/global-comprehensive.service';
import { LocalComprehensiveService } from '@service/comprehensive/local-comprehensive.service';
import { registerService } from '@service/service.provider';

export default abstract class ComprehensiveService {

    getComprehensive(): Observable<Comprehensive> {
        throw new Error(`'getComprehensive' 메소드가 구현되지 않았습니다.`);
    }
    
}

registerService<ComprehensiveService>({
    environment: 'global',
    token: ComprehensiveService,
    useClass: GlobalComprehensiveService
});
registerService<ComprehensiveService>({
    environment: 'local',
    token: ComprehensiveService,
    useClass: LocalComprehensiveService,
    deps: [HttpClient]
});