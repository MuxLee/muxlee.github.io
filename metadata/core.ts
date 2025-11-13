import path from 'path';
import { fileURLToPath } from 'url';

import {
    ClassInjectionIdentityParser,
    InjectionTokenIdetntiyParser,
    NamedInjectionIdentityParser
} from 'lightweight-injection/injection';
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
} from '@metadata/process/processor.js';
import { type Constructor } from '@script/util/util.js';

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
 * @returns {Promise<void | never>}
 */
function bootstrapMetadata(): Promise<void | never> {
    return new Promise(async function(resolve, reject) {
        try {
            const directoryPath = path.dirname(
                fileURLToPath(import.meta.url)
            );
            const injector = new StoredInjector();

            injector.registerParser(new ClassInjectionIdentityParser());
            injector.registerParser(new InjectionTokenIdetntiyParser());
            injector.registerParser(new NamedInjectionIdentityParser());

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