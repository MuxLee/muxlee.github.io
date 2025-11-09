import { ClassInjectionToken, FactoryInjectionToken } from 'lightweight-injection/injection';
import type { Injector } from 'lightweight-injection/injector';
import { injectorConfig  } from 'lightweight-injection/injector';

import Metadatas from '@metadata/constant.js';
import type { MetadataOptionTypeContext } from '@metadata/context/context.js';
import type { FileObject } from '@script/blob/blob.js';
import type { FileLoader } from '@script/loader/loader.js';
import {
    AsyncFileLoader,
    SimpleDirectoryContextLoader,
    SimpleFileContextLoader,
    SyncFileLoader
} from '@script/loader/loader.js';

/**
 * 파일 로더를 반환합니다.
 * 
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자
 * @returns {FileLoader<unknown, FileObject | Promise<FileObject>>} 파일 로더
 */
function _getFileLoader(injector: Pick<Injector, 'get'>): FileLoader<unknown, FileObject | Promise<FileObject>> {
    const options = injector.get<Record<string, MetadataOptionTypeContext>>(Metadatas.OPTIONS);

    if (options['useAsync']) {
        const timeout = (options['timeout'] as number) ?? 2000;

        return new AsyncFileLoader(timeout);
    }

    return new SyncFileLoader();
}

export default injectorConfig(function(injector) {
    injector.create(new ClassInjectionToken('DIRECTORY_CONTEXT_LOADER', SimpleDirectoryContextLoader));
    injector.create(new ClassInjectionToken('FILE_CONTEXT_LOADER', SimpleFileContextLoader));
    injector.create(new FactoryInjectionToken('FILE_LOADER', _getFileLoader));
}, '메타데이터 로더 의존성');