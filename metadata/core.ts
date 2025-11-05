import { StoredInjector } from 'lightweight-injection/injector';

import {
    MetadataCommandParseProcessor,
    MetadataCommandProcessor,
    MetadataContentGenerateProcessor,
    MetadataFileGeneratorProcessor,
    MetadataInitializeProcessor,
    MetadataInjectionProcessor,
    MetadataLoadProcessor,
    MetadataProcessor
} from '@metadata/process/processor';
import type { Constructor } from '@script/util/util';

/**
 * 기본 설정 작업 수행자 목록
 * 
 * @type {Constructor<MetadataProcessor>[]}
 */
const defaultConfigures: Constructor<MetadataProcessor>[] = [
    MetadataInitializeProcessor,
    MetadataInjectionProcessor,
    MetadataCommandProcessor,
    MetadataCommandParseProcessor,
    MetadataLoadProcessor,
    MetadataContentGenerateProcessor,
    MetadataFileGeneratorProcessor
];

/**
 * 메타데이터 구축 함수
 * 
 * @param {string} directoryPath 수행 폴더 경로
 * @returns {Promise<void | never>}
 */
function bootstrapMetadata(directoryPath: string): Promise<void | never> {
    return new Promise(async function(resolve, reject) {
        try {
            const injector = new StoredInjector();

            for (const defaultConfigure of defaultConfigures) {
                await Reflect.construct(defaultConfigure, [directoryPath]).process(injector);
            }

            resolve();
        }
        catch (error) {
            reject(error);
        }
    });
}

export {
    bootstrapMetadata
};