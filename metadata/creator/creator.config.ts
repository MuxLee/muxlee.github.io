import { TupleFactoryInjectionToken } from 'lightweight-injection/injection';
import type { Injector } from 'lightweight-injection/injector';
import { injectorConfig } from 'lightweight-injection/injector';

import Metadatas from '@metadata/constant';
import type { MetadataContextFactory } from '@metadata/context/context';
import { MetadataContentCreator, MetadataContextCreator, MetadataObjectCreator } from '@metadata/creator/creator';
import type { MetadataCreatePostProcessor } from '@metadata/process/processor';
import type { FileLoader } from '@script/loader/loader';
import type { Deserializer } from '@script/serialize/serializer';

/**
 * 메타데이터 내용 생성기를 반환합니다.
 * 
 * @protected
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자
 * @returns {MetadataContentCreator} 내용 생성기
 */
function _getMetadataContentCreator(injector: Pick<Injector, 'get'>): MetadataContentCreator {
    const fileLoader = injector.get<FileLoader<unknown>>('FILE_LOADER');

    return new MetadataContentCreator(fileLoader);
}

/**
 * 메타데이터 정보 생성기를 반환합니다.
 * 
 * @protected
 * @param {MetadataContextFactory<unknown, unknown>[]} metadataContextFactories 메타데이터 정보 생성기 목록
 * @returns {MetadataContextCreator} 정보 생성기
 */
function _getMetadataContextCreator(
    metadataContextFactories: MetadataContextFactory<unknown, unknown>[]
): MetadataContextCreator {
    const metadataContextCreator = new MetadataContextCreator();

    for (const metadataContextFactory of metadataContextFactories) {
        metadataContextCreator.registerContextFactory(metadataContextFactory);
    }

    return metadataContextCreator;
}

/**
 * 메타데이터 객체 생성기를 반환합니다.
 * 
 * @protected
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자
 * @returns {MetadataObjectCreator} 객체 생성기
 */
function _getMetadataObjectCreator(injector: Pick<Injector, 'get'>): MetadataObjectCreator {
    const metadataDeserializers = injector.get<Deserializer<object | string, object>[]>(Metadatas.DESERIALIZERS);
    const metadataPostProcessors = injector.get<MetadataCreatePostProcessor[]>('METADATA_POST_PROCESSORS');
    const metadataObjectCreator = new MetadataObjectCreator();

    for (const metadataDeserializer of metadataDeserializers) {
        metadataObjectCreator.registerDeserializer(metadataDeserializer);
    }
    
    for (const metadataPostProcessor of metadataPostProcessors) {
        metadataObjectCreator.registerProcessors(metadataPostProcessor);
    }

    return metadataObjectCreator;
}

/**
 * 메타데이터 정보 후처리 생성기를 반환합니다.
 * 
 * @protected
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자
 * @returns {MetadataContextCreator} 후처리 생성기
 */
function _getMetadataPostContextCreator(injector: Pick<Injector, 'get'>): MetadataContextCreator {
    const contextFactories = injector.get<MetadataContextFactory<unknown, unknown>[]>('POST_CONTEXT_FACTORIES');
    
    return _getMetadataContextCreator(contextFactories);
}

/**
 * 메타데이터 정보 전처리 생성기를 반환합니다.
 * 
 * @protected
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자
 * @returns {MetadataContextCreator} 메타데이터 정보 생성기
 */
function _getMetadataPreContextCreator(injector: Pick<Injector, 'get'>): MetadataContextCreator {
    const contextFactories = injector.get<MetadataContextFactory<unknown, unknown>[]>('PRE_CONTEXT_FACTORIES');
    
    return _getMetadataContextCreator(contextFactories);
}

export default injectorConfig(function(injector: Injector) {
    injector.create(new TupleFactoryInjectionToken(Metadatas.CREATORS, function(injector) {
        const metadataContentCreator = _getMetadataContentCreator(injector);
        const metadataObjectCreator = _getMetadataObjectCreator(injector);
        const metadataPostContextCreator = _getMetadataPostContextCreator(injector);
        const metadataPreContextCreator = _getMetadataPreContextCreator(injector);
        
        return [
            metadataPreContextCreator,
            metadataContentCreator,
            metadataObjectCreator,
            metadataPostContextCreator,
            metadataContentCreator,
            metadataObjectCreator
        ];
    }));
}, '메타데이터 내용/정보 생성기 의존성');