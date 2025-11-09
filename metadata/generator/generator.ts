import fileSystem from 'fs';
import type { Injector } from 'lightweight-injection/injector';
import path from 'path';

import Metadatas from '@metadata/constant.js';
import type { MetadataContext, MetadataOptionTypeContext } from '@metadata/context/context.js';
import { MetadataGlobalContext } from '@metadata/context/context.js';
import type { Comprehensive, Page } from '@metadata/model/model.js';
import { LocalComprehensive, LocalPage } from '@metadata/model/model.js';
import type { Serializer } from '@script/serialize/serializer.js';
import { onlyFilePath } from '@script/util/util.js';

/**
 * 메타데이터 내용 생성기 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface MetadataContentGenerator {

    /**
     * 메타데이터 내용을 생성합니다.
     * 
     * @param {Injector} injector 의존성 주입자
     * @param {MetadataContext} metadataContext 메타데이터 정보
     */
    generate(injector: Injector, metadataContext: MetadataContext): void;

}

/**
 * 메타데이터 파일 생성기 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface MetadataFileGenerator {

    /**
     * 메타데이터 파일을 생성합니다.
     * 
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {Promise<void>}
     */
    generate(metadataContext: MetadataContext): Promise<void>;

}

/**
 * 메타데이터 내용 생성기 클래스
 * 
 * @protected
 * @implements {MetadataContentGenerator}
 * @author Mux
 * @version 1.0.0
 */
abstract class AbstractMetadataContentGenerator implements MetadataContentGenerator {

    /**
     * 메타데이터 내용을 생성합니다.
     * 
     * @param {Injector} injector 의존성 주입자
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {void}
     */
    generate(injector: Injector, metadataContext: MetadataContext): void {
        if (metadataContext instanceof MetadataGlobalContext) {
            this._generate(injector, metadataContext);
        }
    }

    /**
     * 메타데이터 내용을 생성합니다.
     * 
     * @protected
     * @param {Injector} injector 의존성 주입자
     * @param {MetadataGlobalContext} metadataContext 메타데이터 정보
     * @returns {void}
     */
    _generate(injector: Injector, metadataContext: MetadataGlobalContext): void {
        throw new Error('\'_process\' 메소드가 구현되지 않았습니다.');
    }

}

/**
 * 종합 메타데이터 내용 생성기 클래스
 * 
 * @extends {AbstractMetadataContentGenerator}
 * @author Mux
 * @version 1.0.0
 */
class LocalComprehensiveContentGenerator extends AbstractMetadataContentGenerator {

    /**
     * 종합 메타데이터 내용을 생성합니다.
     * 
     * @override
     * @protected
     * @param {Injector} injector 의존성 주입자
     * @param {MetadataGlobalContext} metadataContext 메타데이터 정보
     * @returns {void}
     */
    override _generate(injector: Injector, metadataContext: MetadataGlobalContext): void {
        const comprehensive = metadataContext.comprehensive ?? LocalComprehensive.withDefault();
        const posts = metadataContext.posts;
        const postsLength = posts.length;

        if (postsLength > 0) {
            const latestPost = posts[0];

            comprehensive.updateLatestCategories = latestPost.categories;
            comprehensive.updateLatestPost = onlyFilePath(latestPost);
            comprehensive.updatePostCount = comprehensive.postCount + postsLength;

            for (const post of posts) {
                for (const category of post.categories) {
                    const filePath = onlyFilePath(post);

                    comprehensive.putCategory(category, filePath);
                }
            }
        }

        const pages = metadataContext.pages;
        const pagesLength = pages.length;

        if (pagesLength > 0) {
            const latestPage = pages[0];

            comprehensive.updateLatestPage = onlyFilePath(latestPage);
            comprehensive.updatePageCount = comprehensive.pageCount + pagesLength;

            for (const page of pages) {
                comprehensive.addPage = onlyFilePath(page);
            }
        }

        metadataContext.comprehensive = comprehensive;
    }

}

/**
 * 종합 메타데이터 파일 생성기 클래스
 * 
 * @implements {MetadataFileGenerator}
 * @author Mux
 * @version 1.0.0
 */
class LocalComprehensiveFileGenerator implements MetadataFileGenerator {

    /**
     * 메타데이터 직렬화
     * 
     * @type {Serializer<Comprehensive, string>}
     */
    #serializer: Serializer<Comprehensive, string>;

    /**
     * {@link LocalComprehensiveFileGenerator} 클래스의 생성자입니다.
     * 
     * @param {Serializer<Comprehensive, string>} serializer 메타데이터 직렬화
     */
    constructor(serializer: Serializer<Comprehensive, string>) {
        this.#serializer = serializer;
    }

    /**
     * 종합 메타데이터 파일을 생성합니다.
     * 
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {Promise<void>}
     */
    async generate(metadataContext: MetadataContext): Promise<void> {
        if (metadataContext instanceof MetadataGlobalContext) {
            const filePath = this.#getFilePath(metadataContext);
            const serializeData = this.#getSerializeData(metadataContext);

            await fileSystem.promises.writeFile(filePath, serializeData);
        }
    }

    /**
     * 종합 메타데이터 파일을 생성할 경로를 반환합니다.
     * 
     * @param {MetadataGlobalContext} metadataContext 메타데이터 정보
     * @returns {string} 생성 경로
     */
    #getFilePath(metadataContext: MetadataGlobalContext): string {
        const fileName = metadataContext.options['comprehensiveGenerateFileName'] as string;
        const directoryName = metadataContext.options['comprehensiveGeneratePath'] as string;
        const rootDirectoryPath = metadataContext.options['rootDirectory'] as string;

        return path.join(rootDirectoryPath, directoryName, fileName);
    }

    /**
     * 종합 메타데이터의 직렬화된 문자열을 반환합니다.
     * 
     * @param {MetadataGlobalContext} metadataContext 메타데이터 정보
     * @returns {string} 문자열
     */
    #getSerializeData(metadataContext: MetadataGlobalContext): string {
        const comprehensive = metadataContext.comprehensive;

        if (this.#serializer.supports(comprehensive)) {
            return this.#serializer.serialize(comprehensive as LocalComprehensive);
        }

        throw new Error('종합 메타데이터를 직렬화할 수 없습니다.');
    }

}

/**
 * 페이지 메타데이터 내용 생성기 클래스
 * 
 * @extends {AbstractMetadataContentGenerator}
 * @author Mux
 * @version 1.0.0
 */
class LocalPageContentGenerator extends AbstractMetadataContentGenerator {

    /**
     * 페이지 메타데이터 내용을 생성합니다.
     * 
     * @override
     * @protected
     * @param {Injector} injector 의존성 주입자
     * @param {MetadataGlobalContext} metadataContext 메타데이터 정보
     * @returns {void}
     */
    override _generate(injector: Injector, metadataContext: MetadataGlobalContext): void {
        const posts = metadataContext.posts;
        const postsLength = posts.length;

        if (postsLength > 0) {
            const legacyPage = metadataContext.page;
            let postsIndex = postsLength - 1;

            if (legacyPage && legacyPage.postCount < 2) {
                for (postsIndex; postsIndex >= 0; postsIndex = postsIndex - 1) {
                    if (legacyPage.postCount === 50) {
                        break;
                    }

                    const post = posts[postsIndex];

                    legacyPage.addPost = post;
                }
            }

            if (postsIndex >= 0 && postsIndex < postsLength) {
                const options = injector.get<Record<string, MetadataOptionTypeContext>>(Metadatas.OPTIONS);
                const directoryPath = options['pageGeneratePath'] as string;
                let page = LocalPage.withDefault(directoryPath);
                const pages = metadataContext.pages;

                if (legacyPage) {
                    legacyPage.updateNextPage = onlyFilePath(page);
                    page.updatePreviousPage = onlyFilePath(legacyPage);
                }

                for (postsIndex; postsIndex >= 0; postsIndex = postsIndex - 1) {
                    const post = posts[postsIndex];
                    
                    if (page.postCount === 50) {
                        const nextPage = LocalPage.withDefault(directoryPath);

                        page.updateNextPage = onlyFilePath(nextPage);
                        nextPage.updatePreviousPage = onlyFilePath(page);
                        pages.unshift(page);
                        page = nextPage;
                    }

                    page.addPost = post;
                }

                const latestPage = pages.at(0);

                if (!latestPage || latestPage.fileName !== page.fileName) {
                    pages.unshift(page);
                }
            }
        }
    }

}

/**
 * 페이지 메타데이터 파일 생성기 클래스
 * 
 * @implements {MetadataFileGenerator}
 * @author Mux
 * @version 1.0.0
 */
class LocalPageFileGenerator implements MetadataFileGenerator {

    /**
     * 메타데이터 직렬화
     * 
     * @type {Serializer<Page, string>}
     */
    #serializer: Serializer<Page, string>;

    /**
     * {@link LocalPageFileGenerator} 클래스의 생성자입니다.
     * 
     * @param {Serializer<Page, string>} serializer 메타데이터 직렬화
     */
    constructor(serializer: Serializer<Page, string>) {
        this.#serializer = serializer;
    }

    /**
     * 페이지 메타데이터 파일을 생성합니다.
     * 
     * @param {MetadataContext} metadataContext 
     * @returns {Promise<void>}
     */
    async generate(metadataContext: MetadataContext): Promise<void> {
        if (metadataContext instanceof MetadataGlobalContext) {
            const directoryPath = this.#getDirectoryPath(metadataContext);
            const page = metadataContext.page;
            const pages = metadataContext.pages;

            if (page) {
                pages.push(page);
            }

            for (const page of pages) {
                const filePath = path.join(directoryPath, page.fileName);
                const serializeData = this.#getSerializeData(page);

                await fileSystem.promises.writeFile(filePath, serializeData);
            }
        }
    }

    /**
     * 페이지 메타데이터 파일을 생성할 경로를 반환합니다.
     * 
     * @param {MetadataGlobalContext} metadataContext 메타데이터 정보
     * @returns {string} 생성 경로
     */
    #getDirectoryPath(metadataContext: MetadataGlobalContext): string {
        return metadataContext.options['pageGeneratePath'] as string;
    }

    /**
     * 페이지 메타데이터의 직렬화된 문자열을 반환합니다.
     * 
     * @param {Page} page 메타데이터 정보
     * @returns {string} 문자열
     */
    #getSerializeData(page: Page): string {
        if (this.#serializer.supports(page)) {
            return this.#serializer.serialize(page);
        }

        throw new Error('페이지 메타데이터를 직렬화할 수 없습니다.');
    }

}

/**
 * 게시글 메타데이터 내용 생성기 클래스
 * 
 * @extends {AbstractMetadataContentGenerator}
 * @author Mux
 * @version 1.0.0
 */
class LocalPostContentGenerator extends AbstractMetadataContentGenerator {

    /**
     * 게시글 메타데이터 내용을 생성합니다.
     * 
     * @override
     * @protected
     * @param {Injector} injector 의존성 주입자
     * @param {MetadataGlobalContext} metadataContext 메타데이터 정보
     * @returns {void}
     */
    override _generate(injector: Injector, metadataContext: MetadataGlobalContext): void {
        const posts = metadataContext.posts;
        const postsLength = posts.length;

        if (postsLength > 0) {
            const legacyPost = metadataContext.post;

            if (legacyPost) {
                const nextPost = posts[postsLength - 1];

                legacyPost.updateNextPost = onlyFilePath(nextPost);
                nextPost.updatePreviousPost = onlyFilePath(legacyPost);

                const page = metadataContext.page;

                if (page && page.postCount > 0) {
                    const latestPost = page.posts[0];

                    if (legacyPost.fileName === latestPost.fileName) {
                        page.posts.splice(0, 1, legacyPost);
                    }
                }
            }

            for (let postIndex = 0; postIndex < postsLength;) {
                const post = posts[postIndex];
                const nextPostIndex = postIndex + 1;

                if (nextPostIndex < postsLength) {
                    const nextPost = posts[nextPostIndex];

                    post.updatePreviousPost = onlyFilePath(nextPost);
                    nextPost.updateNextPost = onlyFilePath(post);
                }

                postIndex = nextPostIndex;
            }
        }
    }

}

/**
 * 게시글 메타데이터 파일 생성기 클래스
 * 
 * @implements {MetadataFileGenerator}
 * @author Mux
 * @version 1.0.0
 */
class LocalPostFileGenerator implements MetadataFileGenerator {

    /**
     * 게시글 메타데이터 파일을 생성합니다.
     * 
     * @param {MetadataContext} metadataContext 
     * @returns {Promise<void>}
     */
    async generate(metadataContext: MetadataContext): Promise<void> {
        if (metadataContext instanceof MetadataGlobalContext) {
            const generatePath = this.#getGeneratePath(metadataContext);
            const loadPath = this.#getLoadPath(metadataContext);
            const post = metadataContext.post;
            const posts = metadataContext.posts;

            if (post) {
                posts.push(post);
            }

            for (const post of posts) {
                const sourcePath = path.join(loadPath, post.originalFileName);
                const destinationPath = path.join(generatePath, post.fileName);

                await fileSystem.promises.copyFile(sourcePath, destinationPath);
            }
        }
    }

    /**
     * 게시글 메타데이터 파일을 생성할 경로를 반환합니다.
     * 
     * @param {MetadataGlobalContext} metadataContext 메타데이터 정보
     * @returns {string} 생성 경로
     */
    #getGeneratePath(metadataContext: MetadataGlobalContext): string {
        return metadataContext.options['postGeneratePath'] as string;
    }

    /**
     * 게시글 메타데이터 파일을 불러올 경로를 반환합니다.
     * 
     * @param {MetadataGlobalContext} metadataContext 메타데이터 정보
     * @returns {string} 불러올 경로
     */
    #getLoadPath(metadataContext: MetadataGlobalContext): string {
        return metadataContext.options['postLoadPath'] as string;
    }

}

export type {
    MetadataContentGenerator,
    MetadataFileGenerator
};

export {
    LocalComprehensiveContentGenerator,
    LocalComprehensiveFileGenerator,
    LocalPageContentGenerator,
    LocalPageFileGenerator,
    LocalPostContentGenerator,
    LocalPostFileGenerator
};