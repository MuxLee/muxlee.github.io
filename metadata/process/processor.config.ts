import { ArrayInjectionToken } from 'lightweight-injection/injection';
import type { Injector } from 'lightweight-injection/injector';
import { injectorConfig } from 'lightweight-injection/injector';

import {
    LocalComprehensiveCreatorPostProcessor,
    LocalPageCreatorPostProcessor,
    LocalPostCreatorPostProcessor
} from '@metadata/process/processor.js';

export default injectorConfig(function(injector: Injector) {
    injector.create(new ArrayInjectionToken('METADATA_POST_PROCESSORS', [
        LocalComprehensiveCreatorPostProcessor,
        LocalPageCreatorPostProcessor,
        LocalPostCreatorPostProcessor
    ]));
}, '메타데이터 설정/후처리 작업 수행 의존성');