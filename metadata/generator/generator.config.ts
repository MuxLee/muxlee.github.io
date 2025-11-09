import { ArrayInjectionToken, TupleFactoryInjectionToken } from 'lightweight-injection/injection';
import type { Injector } from 'lightweight-injection/injector';
import { injectorConfig } from 'lightweight-injection/injector';

import {
    LocalComprehensiveContentGenerator,
    LocalComprehensiveFileGenerator,
    LocalPageContentGenerator,
    LocalPageFileGenerator,
    LocalPostContentGenerator,
    LocalPostFileGenerator
} from '@metadata/generator/generator.js';
import type { Comprehensive, Page } from '@metadata/model/model.js';
import type { Serializer } from '@script/serialize/serializer.js';

export default injectorConfig(function(injector: Injector) {
    injector.create(new ArrayInjectionToken('METADATA_CONTENT_GENERATORS', [
        LocalPostContentGenerator,
        LocalPageContentGenerator,
        LocalComprehensiveContentGenerator
    ]));
    injector.create(new TupleFactoryInjectionToken('METADATA_FILE_GENERATORS', function(injector: Pick<Injector, 'get'>) {
        const comprehensiveSerializer = injector.get<Serializer<Comprehensive, string>>('ComprehensiveSerializer');
        const pageSerializer = injector.get<Serializer<Page, string>>('PageSerializer');

        return [
            new LocalComprehensiveFileGenerator(comprehensiveSerializer),
            new LocalPageFileGenerator(pageSerializer),
            new LocalPostFileGenerator()
        ];
    }));
}, '메타데이터 내용/파일 생성기 의존성');