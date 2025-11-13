import { ArrayInjectionToken } from 'lightweight-injection/injection';
import { type CreateInjector, injectorConfig } from 'lightweight-injection/injector';

import Metadatas from '@metadata/constant.js';
import {
    LocalComprehensiveDeserializer,
    LocalComprehensiveSerializer,
    LocalPageDeserializer,
    LocalPageSerializer,
    LocalPostDeserializer
} from '@metadata/serialize/serializer.js';
import { MetaDeserializer, ObjectDeserializer } from '@script/serialize/serializer.js';

export default injectorConfig(function(injector: CreateInjector) {
    injector.create(new ArrayInjectionToken(Metadatas.DESERIALIZERS, [
        MetaDeserializer,
        ObjectDeserializer,
        LocalComprehensiveDeserializer,
        LocalPageDeserializer,
        LocalPostDeserializer
    ]));
    injector.create(LocalComprehensiveSerializer, {
        name: 'ComprehensiveSerializer'
    });
    injector.create(LocalPageSerializer, {
        name: 'PageSerializer'
    });
}, '메타데이터 직렬화/역직렬화 의존성 설정');