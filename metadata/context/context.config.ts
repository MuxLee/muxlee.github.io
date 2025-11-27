import { TupleFactoryInjectionToken } from 'lightweight-injection/injection';
import type { Injector } from 'lightweight-injection/injector';
import { injectorConfig } from 'lightweight-injection/injector';

import {
    LocalComprehensiveFileContextFactory,
    LocalPageFileContextFactory,
    LocalPostFileContextFactory,
    MarkdownFileContextFactory
} from '@metadata/context/context.js';
import type { DirectoryContextLoader, FileContextLoader } from '@script/loader/loader.js';

/**
 * 종합 메타데이터 정보 생성기를 반환합니다.
 * 
 * @protected
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자
 * @returns {LocalComprehensiveFileContextFactory} 정보 생성기
 */
function _getLocalComprehensiveFileContextFactory(injector: Pick<Injector, 'get'>): LocalComprehensiveFileContextFactory {
    const fileContextLoader = injector.get<FileContextLoader>('FILE_CONTEXT_LOADER');

    return new LocalComprehensiveFileContextFactory(fileContextLoader);
}

/**
 * 페이지 메타데이터 정보 생성기를 반환합니다.
 * 
 * @protected
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자
 * @returns {LocalPageFileContextFactory} 정보 생성기
 */
function _getLocalPageFileContextFactory(injector: Pick<Injector, 'get'>): LocalPageFileContextFactory {
    const fileContextLoader = injector.get<FileContextLoader>('FILE_CONTEXT_LOADER');

    return new LocalPageFileContextFactory(fileContextLoader);
}

/**
 * 게시글 메타데이터 정보 생성기를 반환합니다.
 * 
 * @protected
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자 
 * @returns {LocalPostFileContextFactory} 정보 생성기
 */
function _getLocalPostFileContextFactory(injector: Pick<Injector, 'get'>): LocalPostFileContextFactory {
    const fileContextLoader = injector.get<FileContextLoader>('FILE_CONTEXT_LOADER');

    return new LocalPostFileContextFactory(fileContextLoader);
}

/**
 * 마크다운 파일 정보 생성기를 반환합니다.
 * 
 * @protected
 * @param {Pick<Injector, 'get'>} injector 의존성 주입자
 * @returns {MarkdownFileContextFactory} 정보 생성기
 */
function _getMarkdownFileContextFactory(injector: Pick<Injector, 'get'>): MarkdownFileContextFactory {
    const directoryContextLoader = injector.get<DirectoryContextLoader>('DIRECTORY_CONTEXT_LOADER');
    const fileContextLoader = injector.get<FileContextLoader>('FILE_CONTEXT_LOADER');

    return new MarkdownFileContextFactory(directoryContextLoader, fileContextLoader);
}

export default injectorConfig(function(injector: Injector) {
    injector.create(new TupleFactoryInjectionToken('POST_CONTEXT_FACTORIES', function(injector: Pick<Injector, 'get'>) {
        const pageFileContextFactory = _getLocalPageFileContextFactory(injector);
        const postFileContextFactory = _getLocalPostFileContextFactory(injector);

        return [
            pageFileContextFactory,
            postFileContextFactory
        ];
    }));
    injector.create(new TupleFactoryInjectionToken('PRE_CONTEXT_FACTORIES', function(injector: Pick<Injector, 'get'>) {
        const comprehensiveFileContextFactory = _getLocalComprehensiveFileContextFactory(injector);
        const markdownFileContextFactory = _getMarkdownFileContextFactory(injector);
        const pageFileContextFactory = _getLocalPageFileContextFactory(injector);

        return [
            comprehensiveFileContextFactory,
            markdownFileContextFactory,
            pageFileContextFactory
        ];
    }));
}, '메타데이터 정보 생성기 의존성');