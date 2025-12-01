import { TupleFactoryInjectionToken } from 'lightweight-injection/injection';
import { type CreateInjector, type GetInjector, injectorConfig } from 'lightweight-injection/injector';

import Metadatas from '@metadata/constant.js';
import { type MetadataContextFactory } from '@metadata/context/context.js';
import { MetadataContentCreator, MetadataContextCreator, MetadataObjectCreator } from '@metadata/creator/creator.js';
import { type MetadataCreatePostProcessor } from '@metadata/process/processor.js';
import { type FileLoader } from '@script/loader/loader.js';
import { type Deserializer } from '@script/serialize/serializer.js';

/**
 * 메타데이터 내용 생성기를 반환합니다.
 * 
 * @protected
 * @param {GetInjector} injector 의존성 주입자
 * @returns {MetadataContentCreator} 내용 생성기
 */
function _getMetadataContentCreator(injector: GetInjector): MetadataContentCreator {
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
 * @param {GetInjector} injector 의존성 주입자
 * @returns {MetadataObjectCreator} 객체 생성기
 */
function _getMetadataObjectCreator(injector: GetInjector): MetadataObjectCreator {
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
 * @param {GetInjector} injector 의존성 주입자
 * @returns {MetadataContextCreator} 후처리 생성기
 */
function _getMetadataPostContextCreator(injector: GetInjector): MetadataContextCreator {
    const contextFactories = injector.get<MetadataContextFactory<unknown, unknown>[]>('POST_CONTEXT_FACTORIES');
    
    return _getMetadataContextCreator(contextFactories);
}

/**
 * 메타데이터 정보 전처리 생성기를 반환합니다.
 * 
 * @protected
 * @param {GetInjector} injector 의존성 주입자
 * @returns {MetadataContextCreator} 메타데이터 정보 생성기
 */
function _getMetadataPreContextCreator(injector: GetInjector): MetadataContextCreator {
    const contextFactories = injector.get<MetadataContextFactory<unknown, unknown>[]>('PRE_CONTEXT_FACTORIES');
    
    return _getMetadataContextCreator(contextFactories);
}

export default injectorConfig(function(injector: CreateInjector) {
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