import path from 'path';

import { LocalComprehensive, LocalPage, LocalPost } from '@metadata/model/model.js';
import type { Pair } from '@script/collection/collection.js';
import type { Context, FileContext, PathContext } from '@script/context/context.js';
import { EmptyPathContext, SimplePathContext } from '@script/context/context.js';
import type { DirectoryContextLoader, FileContextLoader } from '@script/loader/loader.js';
import type { Nullable, Tuple } from '@script/util/util.js';

/**
 * 메타데이터 정보 인터페이스
 * 
 * @extends {Context}
 * @author Mux
 * @version 1.0.0
 */
interface MetadataContext extends Context {

    /**
     * 메타데이터 명령어를 반환합니다.
     *
     * @returns {Record<string, MetadataOptionTypeContext>} 명령어
     */
    get options(): Record<string, MetadataOptionTypeContext>;

}

/**
 * 메타데이터 정보 생성기 인터페이스
 *
 * @template T 개체 유형
 * @template R 반환 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface MetadataContextFactory<T, R> {

    /**
     * 메타데이터 정보를 생성하여 반환합니다.
     *
     * @param {T} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {Nullable<R>} 정보
     */
    factory(object: T, metadataContext: MetadataContext): Nullable<R>;

}

/**
 * 메타데이터 정보 튜플 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type MetadataContexts = Pair<object, Tuple<[MetadataContext, FileContext]>>;

/**
 * 메타데이터 생성 설정 정보 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type MetadataOptionTypeContext = boolean | number | string;

/**
 * 메타데이터 파일 정보 생성기 클래스
 *
 * @protected
 * @template T 개체 유형
 * @template R 반환 개체 유형
 * @implements {MetadataContextFactory<T, R>}
 * @author Mux
 * @version 1.0.0
 */
abstract class AbstractMetadataFileContextFactory<T, R> implements MetadataContextFactory<T, R> {

    /**
     * 파일 정보 로더
     *
     * @protected
     * @type {FileContextLoader}
     */
    _fileContextLoader: FileContextLoader;

    /**
     * {@link AbstractMetadataFileContextFactory} 클래스의 생성자입니다.
     *
     * @param {FileContextLoader} fileContextLoader 파일 정보 로더
     */
    constructor(fileContextLoader: FileContextLoader) {
        this._fileContextLoader = fileContextLoader;
    }

    /**
     * 메타데이터 파일 정보를 생성하여 반환합니다.
     *
     * @param {T} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {Nullable<R>} 파일 정보
     */
    factory(object: T, metadataContext: MetadataContext): Nullable<R> {
        throw new Error('\'factory\' 메소드가 구현되지 않았습니다.');
    }

    /**
     * 메타데이터 파일 정보를 생성하여 반환합니다.
     *
     * @protected
     * @param {T} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {Nullable<FileContext>} 파일 정보
     */
    _factory(object: T, metadataContext: MetadataContext): Nullable<FileContext> {
        const context = this._toContext(object, metadataContext);

        if (this._fileContextLoader.supports(context)) {
            return this._fileContextLoader.load(context);
        }

        return null;
    }

    /**
     * 메타데이터 파일 경로 정보를 반환합니다.
     *
     * @protected
     * @param {T} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {PathContext} 파일 경로 정보
     */
    _toContext(object: T, metadataContext: MetadataContext): PathContext {
        throw new Error('\'_toPathContext\' 메소드가 구현되지 않았습니다.')
    }

}

/**
 * 종합 파일 정보 생성기 클래스
 *
 * @extends {AbstractMetadataFileContextFactory<unknown, FileContext>}
 * @author Mux
 * @version 1.0.0
 */
class LocalComprehensiveFileContextFactory extends AbstractMetadataFileContextFactory<unknown, FileContext> {

    /**
     * {@link LocalComprehensiveFileContextFactory} 클래스의 생성자입니다.
     *
     * @param {FileContextLoader} fileContextLoader 파일 정보 로더
     */
    constructor(fileContextLoader: FileContextLoader) {
        super(fileContextLoader);
    }

    /**
     * 종합 메타데이터 파일 정보를 생성하여 반환합니다.
     * 
     * @override
     * @param {unknown} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {Nullable<FileContext>} 파일 정보
     */
    override factory(object: unknown, metadataContext: MetadataContext): Nullable<FileContext> {
        return super._factory(object, metadataContext);
    }

    /**
     * 종합 파일 경로 정보를 반환합니다.
     *
     * @override
     * @protected
     * @param {unknown} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {PathContext} 파일 경로 정보
     */
    override _toContext(object: unknown, metadataContext: MetadataContext): PathContext {
        if (metadataContext instanceof MetadataGlobalContext) {
            const metadataOption = metadataContext.options;
            const comprehensiveDirectoryPath = metadataOption['comprehensiveLoadPath'] as string;
            const comprehensiveFileName = metadataOption['comprehensiveLoadFileName'] as string;
            const comprehensiveFilePath = path.join(comprehensiveDirectoryPath, comprehensiveFileName);

            return new SimplePathContext(comprehensiveFilePath);
        }

        return new EmptyPathContext();
    }

}

/**
 * 페이지 파일 정보 생성기 클래스
 *
 * @extends {AbstractMetadataFileContextFactory<unknown, FileContext>}
 * @author Mux
 * @version 1.0.0
 */
class LocalPageFileContextFactory extends AbstractMetadataFileContextFactory<unknown, FileContext> {

    /**
     * {@link LocalPageFileContextFactory} 클래스의 생성자입니다.
     *
     * @param {FileContextLoader} fileContextLoader 파일 정보 로더
     */
    constructor(fileContextLoader: FileContextLoader) {
        super(fileContextLoader);
    }

    /**
     * 페이지 메타데이터 파일 정보를 생성하여 반환합니다.
     * 
     * @override
     * @param {unknown} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {Nullable<FileContext>} 파일 정보
     */
    override factory(object: unknown, metadataContext: MetadataContext): Nullable<FileContext> {
        return super._factory(object, metadataContext);
    }

    /**
     * 페이지 파일 경로 정보를 생성하여 반환합니다.
     *
     * @override
     * @protected
     * @param {unknown} object 개체
     * @param {MetadataContext} metadataContext
     * @returns {PathContext} 파일 경로 정보
     */
    override _toContext(object: unknown, metadataContext: MetadataContext): PathContext {
        if (metadataContext instanceof MetadataGlobalContext) {
            const comprehensive = metadataContext.comprehensive;

            if (comprehensive) {
                const page = comprehensive.latestPage;

                if (page) {
                    return new SimplePathContext(page.fullPath);
                }
            }
        }

        return new EmptyPathContext();
    }

}

/**
 * 게시글 파일 정보 생성기 클래스
 *
 * @extends {AbstractMetadataFileContextFactory<unknown, FileContext>}
 * @author Mux
 * @version 1.0.0
 */
class LocalPostFileContextFactory extends AbstractMetadataFileContextFactory<unknown, FileContext> {

    /**
     * {@link LocalPostFileContextFactory} 클래스의 생성자입니다.
     *
     * @param {FileContextLoader} fileContextLoader 파일 정보 로더
     */
    constructor(fileContextLoader: FileContextLoader) {
        super(fileContextLoader);
    }

    /**
     * 게시글 메타데이터 파일 정보를 반환합니다.
     * 
     * @override
     * @param {unknown} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {Nullable<FileContext>} 파일 정보
     */
    override factory(object: unknown, metadataContext: MetadataContext): Nullable<FileContext> {
        return super._factory(object, metadataContext);
    }

    /**
     * 게시글 파일 경로 정보를 생성하여 반환합니다.
     *
     * @override
     * @protected
     * @param {unknown} object 개체
     * @param {MetadataContext} metadataContext
     * @returns {PathContext} 파일 경로 정보
     */
    override _toContext(object: unknown, metadataContext: MetadataContext): PathContext {
        if (metadataContext instanceof MetadataGlobalContext) {
            const comprehensive = metadataContext.comprehensive;

            if (comprehensive) {
                const post = comprehensive.latestPost;

                if (post) {
                    return new SimplePathContext(post.fullPath);
                }
            }
        }

        return new EmptyPathContext();
    }

}

/**
 * 마크다운 파일 정보 생성기 클래스
 *
 * @extends {AbstractMetadataFileContextFactory<unknown, FileContext[]>}
 * @author Mux
 * @version 1.0.0
 */
class MarkdownFileContextFactory extends AbstractMetadataFileContextFactory<unknown, FileContext[]> {

    /**
     * 폴더 정보 로더
     *
     * @type {DirectoryContextLoader}
     */
    #directoryContextLoader: DirectoryContextLoader;

    /**
     * {@link MarkdownFileContextFactory} 클래스의 생성자입니다.
     *
     * @param {DirectoryContextLoader} directoryContextLoader 폴더 정보 로더
     * @param {FileContextLoader} fileContextLoader 파일 정보 로더
     */
    constructor(directoryContextLoader: DirectoryContextLoader, fileContextLoader: FileContextLoader) {
        super(fileContextLoader);

        this.#directoryContextLoader = directoryContextLoader
    }

    /**
     * 마크다운 파일 정보를 생성하여 반환합니다.
     *
     * @override
     * @param {unknown} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {FileContext[]} 파일 정보 목록
     */
    override factory(object: unknown, metadataContext: MetadataContext): FileContext[] {
        if (metadataContext instanceof MetadataGlobalContext) {
            const metadataOption = metadataContext.options;
            const markdownDirectoryPath = metadataOption['postLoadPath'] as string;
            const markdownFileExtension = metadataOption['postLoadExtension'] as string;
            const pathContext = new SimplePathContext(markdownDirectoryPath);

            if (this.#directoryContextLoader.supports(pathContext)) {
                const directoryContext = this.#directoryContextLoader.load(pathContext);
                const markdownFileContextArray: FileContext[] = [];

                for (const fileName of directoryContext.fileNames) {
                    if (fileName.endsWith(markdownFileExtension)) {
                        const markdownFilePath = path.join(directoryContext.path, fileName);
                        const fileContext = super._factory(markdownFilePath, metadataContext);

                        if (fileContext) {
                            markdownFileContextArray.push(fileContext);
                        }
                    }
                }

                return markdownFileContextArray;
            }
        }

        return [];
    }

    /**
     * 마크다운 파일 경로 정보를 반환합니다.
     *
     * @override
     * @protected
     * @param {string} markdownFilePath 마크다운 파일 경로
     * @returns {PathContext} 파일 경로 정보
     */
    override _toContext(markdownFilePath: string): PathContext {
        return new SimplePathContext(markdownFilePath);
    }

}

/**
 * 전역 메타데이터 정보 클래스
 *
 * @implements {MetadataContext}
 * @author Mux
 * @version 1.0.0
 */
class MetadataGlobalContext implements MetadataContext {

    /**
     * 종합 메타데이터
     *
     * @type {Nullable<LocalComprehensive>}
     */
    #comprehensive: Nullable<LocalComprehensive>;

    /**
     * 메타데이터 명령어
     *
     * @type {Record<string, MetadataOptionTypeContext>}
     */
    #options: Record<string, MetadataOptionTypeContext>;

    /**
     * 페이지 메타데이터
     *
     * @type {Nullable<LocalPage>}
     */
    #page: Nullable<LocalPage>;

    /**
     * 페이지 메타데이터 목록
     * 
     * @type {LocalPage[]}
     */
    #pages: LocalPage[];

    /**
     * 게시글 메타데이터
     * 
     * @type {Nullable<LocalPost>}
     */
    #post: Nullable<LocalPost>;

    /**
     * 게시글 메타데이터 목록
     *
     * @type {LocalPost[]}
     */
    #posts: LocalPost[];

    /**
     * 정보 고유명
     *
     * @type {string}
     */
    static #contextName: string;

    /**
     * {@link MetadataGlobalContext} 클래스의 생성자입니다.
     * 
     * @param {Record<string, MetadataOptionTypeContext>} options 메타데이터 명령어
     */
    constructor(options: Record<string, MetadataOptionTypeContext>) {
        this.#comprehensive = null;
        this.#options = options;
        this.#page = null;
        this.#pages = [];
        this.#post = null;
        this.#posts = [];
    }

    static {
        this.#contextName = 'MetadataGlobalContext';
    }

    /**
     * 종합 메타데이터를 반환합니다.
     * 
     * @returns {Nullable<LocalComprehensive>} 종합 메타데이터
     */
    get comprehensive(): Nullable<LocalComprehensive> {
        return this.#comprehensive;
    }

    /**
     * 정보의 고유명을 반환합니다.
     *
     * @returns {string} 고유명
     */
    get contextName(): string {
        return MetadataGlobalContext.#contextName;
    }

    /**
     * 메타데이터 명령어를 반환합니다.
     *
     * @returns {Record<string, MetadataOptionTypeContext>} 메타데이터 명령어
     */
    get options(): Record<string, MetadataOptionTypeContext> {
        if (!this.#options) {
            throw new Error('메타데이터 명령어가 존재하지 않습니다.');
        }

        return this.#options;
    }

    /**
     * 페이지 메타데이터를 반환합니다.
     * 
     * @returns {Nullable<LocalPage>} 페이지 메타데이터
     */
    get page(): Nullable<LocalPage> {
        return this.#page;
    }

    /**
     * 페이지 메타데이터 목록을 반환합니다.
     * 
     * @returns {LocalPage[]} 메타데이터 목록
     */
    get pages(): LocalPage[] {
        return this.#pages;
    }

    /**
     * 게시글 메타데이터를 반환합니다.
     * 
     * @returns {Nullable<LocalPost>} 게시글 메타데이터
     */
    get post(): Nullable<LocalPost> {
        return this.#post;
    }

    /**
     * 게시글 메타데이터 목록을 반환합니다.
     * 
     * @returns {LocalPost[]} 메타데이터 목록
     */
    get posts(): LocalPost[] {
        return this.#posts;
    }

    /**
     * 게시글 메타데이터를 추가합니다.
     * 
     * @param {LocalPost} post 게시글 메타데이터
     */
    set addPost(post: LocalPost) {
        this.#posts.push(post);
    }

    /**
     * 종합 메타데이터를 설정합니다.
     * 
     * @param {LocalComprehensive} comprehensive 종합 메타데이터
     */
    set comprehensive(comprehensive: LocalComprehensive) {
        this.#comprehensive = comprehensive;
    }

    /**
     * 페이지 메타데이터를 설정합니다.
     * 
     * @param {LocalPage} page 페이지 메타데이터
     */
    set page(page: LocalPage) {
        this.#page = page;
    }

    /**
     * 게시글 메타데이터를 설정합니다.
     * 
     * @param {LocalPost} post 게시글 메타데이터
     */
    set post(post: LocalPost) {
        this.#post = post;
    }

}

export type {
    MetadataContext,
    MetadataContextFactory,
    MetadataContexts,
    MetadataOptionTypeContext
};

export {
    LocalComprehensiveFileContextFactory,
    LocalPageFileContextFactory,
    LocalPostFileContextFactory,
    MarkdownFileContextFactory,
    MetadataGlobalContext
};