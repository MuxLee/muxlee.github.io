import { TupleFactoryInjectionToken } from 'lightweight-injection/injection';
import { type CreateInjector, type GetInjector, injectorConfig } from 'lightweight-injection/injector';

import {
    LocalComprehensiveFileContextFactory,
    LocalPageFileContextFactory,
    LocalPostFileContextFactory,
    MarkdownFileContextFactory
} from '@metadata/context/context.js';
import { type DirectoryContextLoader, type FileContextLoader } from '@script/loader/loader.js';

/**
 * 종합 메타데이터 정보 생성기를 반환합니다.
 * 
 * @protected
 * @param {GetInjector} injector 의존성 주입자
 * @returns {LocalComprehensiveFileContextFactory} 정보 생성기
 */
function _getLocalComprehensiveFileContextFactory(injector: GetInjector): LocalComprehensiveFileContextFactory {
    const fileContextLoader = injector.get<FileContextLoader>('FILE_CONTEXT_LOADER');

    return new LocalComprehensiveFileContextFactory(fileContextLoader);
}

/**
 * 페이지 메타데이터 정보 생성기를 반환합니다.
 * 
 * @protected
 * @param {GetInjector} injector 의존성 주입자
 * @returns {LocalPageFileContextFactory} 정보 생성기
 */
function _getLocalPageFileContextFactory(injector: GetInjector): LocalPageFileContextFactory {
    const fileContextLoader = injector.get<FileContextLoader>('FILE_CONTEXT_LOADER');

    return new LocalPageFileContextFactory(fileContextLoader);
}

/**
 * 게시글 메타데이터 정보 생성기를 반환합니다.
 * 
 * @protected
 * @param {GetInjector} injector 의존성 주입자 
 * @returns {LocalPostFileContextFactory} 정보 생성기
 */
function _getLocalPostFileContextFactory(injector: GetInjector): LocalPostFileContextFactory {
    const fileContextLoader = injector.get<FileContextLoader>('FILE_CONTEXT_LOADER');

    return new LocalPostFileContextFactory(fileContextLoader);
}

/**
 * 마크다운 파일 정보 생성기를 반환합니다.
 * 
 * @protected
 * @param {GetInjector} injector 의존성 주입자
 * @returns {MarkdownFileContextFactory} 정보 생성기
 */
function _getMarkdownFileContextFactory(injector: GetInjector): MarkdownFileContextFactory {
    const directoryContextLoader = injector.get<DirectoryContextLoader>('DIRECTORY_CONTEXT_LOADER');
    const fileContextLoader = injector.get<FileContextLoader>('FILE_CONTEXT_LOADER');

    return new MarkdownFileContextFactory(directoryContextLoader, fileContextLoader);
}

export default injectorConfig(function(injector: CreateInjector) {
    injector.create(new TupleFactoryInjectionToken('POST_CONTEXT_FACTORIES', function(injector: GetInjector) {
        const pageFileContextFactory = _getLocalPageFileContextFactory(injector);
        const postFileContextFactory = _getLocalPostFileContextFactory(injector);

        return [
            pageFileContextFactory,
            postFileContextFactory
        ];
    }));
    injector.create(new TupleFactoryInjectionToken('PRE_CONTEXT_FACTORIES', function(injector: GetInjector) {
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