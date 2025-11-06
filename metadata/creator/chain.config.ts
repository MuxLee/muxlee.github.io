import { FactoryInjectionToken } from 'lightweight-injection/injection';
import type { Injector } from 'lightweight-injection/injector';
import { injectorConfig } from 'lightweight-injection/injector';

import Metadatas from '@metadata/constant';
import type { MetadataOptionTypeContext } from '@metadata/context/context';
import { AsyncMetadataCreatorChain, MetadataCreatorChain, SyncMetadataCreatorChain } from '@metadata/creator/chain';
import type { MetadataContextCreator } from '@metadata/creator/creator';

/**
 * 메타데이터 생성기 체인을 반환합니다.
 * 
 * @protected
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자
 * @returns {MetadataCreatorChain} 생성기 체인
 */
function _getMetadataCreatorChainConstructor(injector: Pick<Injector, 'get'>): MetadataCreatorChain {
    const creators = injector.get<MetadataContextCreator[]>(Metadatas.CREATORS);
    const options = injector.get<Record<string, MetadataOptionTypeContext>>(Metadatas.OPTIONS);

    if (options['useAsync']) {
        return new AsyncMetadataCreatorChain(creators);
    }

    return new SyncMetadataCreatorChain(creators);
}

export default injectorConfig(function(injector: Injector) {
    injector.create(new FactoryInjectionToken(
        Metadatas.CREATOR_CHAIN,
        _getMetadataCreatorChainConstructor
    ));
}, '메타데이터 생성기 체인 의존성');