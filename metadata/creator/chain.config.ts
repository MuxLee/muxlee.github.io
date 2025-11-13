import { FactoryInjectionToken } from 'lightweight-injection/injection';
import { type CreateInjector, type GetInjector, injectorConfig } from 'lightweight-injection/injector';

import Metadatas from '@metadata/constant.js';
import { type MetadataOptionTypeContext } from '@metadata/context/context.js';
import { AsyncMetadataCreatorChain, MetadataCreatorChain, SyncMetadataCreatorChain } from '@metadata/creator/chain.js';
import { type MetadataContextCreator } from '@metadata/creator/creator.js';

/**
 * 메타데이터 생성기 체인을 반환합니다.
 * 
 * @protected
 * @param {GetInjector} injector 의존성 주입자
 * @returns {MetadataCreatorChain} 생성기 체인
 */
function _getMetadataCreatorChainConstructor(injector: GetInjector): MetadataCreatorChain {
    const creators = injector.get<MetadataContextCreator[]>(Metadatas.CREATORS);
    const options = injector.get<Record<string, MetadataOptionTypeContext>>(Metadatas.OPTIONS);

    if (options['useAsync']) {
        return new AsyncMetadataCreatorChain(creators);
    }

    return new SyncMetadataCreatorChain(creators);
}

export default injectorConfig(function(injector: CreateInjector) {
    injector.create(new FactoryInjectionToken(
        Metadatas.CREATOR_CHAIN,
        _getMetadataCreatorChainConstructor
    ));
}, '메타데이터 생성기 체인 의존성');