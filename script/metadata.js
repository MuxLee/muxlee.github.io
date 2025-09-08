import path from 'path';
import * as uuid from 'uuid';

import { nestedFreeze } from './metadata-util.js';

/**
 * 기본 카테고리 정보
 *
 * @type {LocalCategory}
 */
const defaultCategory = {
    count: 0,
    name: null,
    postFilePaths: []
};

/**
 * 기본 종합 정보
 *
 * @type {LocalComprehensive}
 */
const defaultComprehensive = {
    categories: new Map(),
    categoryCount: 0,
    latestCategories: [],
    latestPage: null,
    latestPost: null,
    pageCount: 0,
    pages: [],
    postCount: 0
};

/**
 * 기본 페이지 정보
 *
 * @type {LocalPage}
 */
const defaultPage = {
    fileName: uuid.MAX + '.page.json',
    folderPath: '',
    posts: [],
    postCount: 0
};

/**
 * 종합 정보 클래스
 *
 * @implements {Comprehensive}
 * @implements {JSONSerializer<LocalComprehensive>}
 */
class LocalComprehensive {

    /**
     * 카테고리 목록
     *
     * @type {Map<string, LocalCategory>}
     */
    #categories;

    /**
     * 최신 업데이트가 발생한 카테고리 목록
     *
     * @type {ReadonlySet<string>}
     */
    #latestCategories;

    /**
     * 최신 페이지
     *
     * @type {Optional<LocalPage>}
     */
    #latestPage;

    /**
     * 최신 게시글
     *
     * @type {Optional<LocalPost>}
     */
    #latestPost;

    /**
     * 페이지 개수
     *
     * @type {number}
     */
    #pageCount;

    /**
     * 페이지 목록
     *
     * @type {LocalPage[]}
     */
    #pages;

    /**
     * 게시글 개수
     *
     * @type {number}
     */
    #postCount;

    /**
     * {@link LocalComprehensive} 클래스 생성자
     *
     * @param {LocalComprehensive} otherComprehensive 다른 종합정보
     */
    constructor(otherComprehensive) {
        this.#categories = new Map(
            Object.entries(otherComprehensive.categories)
        );
        this.#latestCategories = otherComprehensive.latestCategories;
        this.#latestPage = otherComprehensive.latestPage;
        this.#latestPost = otherComprehensive.latestPost;
        this.#pageCount = otherComprehensive.pageCount;
        this.#pages = otherComprehensive.pages;
        this.#postCount = otherComprehensive.postCount;
    }

    /**
     * 카테고리 목록을 반환합니다.
     *
     * @returns {ReadonlyMap<string, Category>} 카테고리 목록
     */
    get categories() {
        return this.#categories;
    }

    /**
     * 카테고리 개수를 반환합니다.
     *
     * @returns {number} 카테고리 개수
     */
    get categoryCount() {
        return this.#categories.size;
    }

    /**
     * 최신 업데이트가 발생한 카테고리 목록을 반환합니다.
     *
     * @returns {ReadonlySet<string> 카테고리 목록
     */
    get latestCategories() {
        return this.#latestCategories;
    }

    /**
     * 최신 페이지 정보를 반환합니다.
     *
     * @returns {Optional<Page>} 최신 페이지 정보
     */
    get latestPage() {
        if (this.#latestPage) {
            return nestedFreeze(this.#latestPage);
        }

        return null;
    }

    /**
     * 최신 게시글 정보를 반환합니다.
     *
     * @returns {Optional<Post>} 최신 게시글 정보
     */
    get latestPost() {
        if (this.#latestPost) {
            return nestedFreeze(this.#latestPost);
        }

        return null;
    }

    /**
     * 페이지 개수를 반환합니다.
     *
     * @returns {number} 페이지 개수
     */
    get pageCount() {
        return this.#pageCount;
    }

    /**
     * 페이지 목록을 반환합니다.
     *
     * @returns {Page[]} 페이지 목록
     */
    get pages() {
        return this.#pages;
    }

    /**
     * 게시글 개수를 반환합니다.
     *
     * @returns {number} 게시글 개수
     */
    get postCount() {
        return this.#postCount;
    }

    /**
     * 페이지 정보를 추가합니다.
     *
     * @param {Page} filePath
     * @returns {void}
     */
    set addPage(filePath) {
        /**
         * @type {Page}
         */
        const formatPage = {};

        Object.defineProperties(formatPage, {
            folderPath: {
                enumerable: true,
                value: filePath.folderPath
            },
            fileName: {
                enumerable: true,
                value: filePath.fileName
            }
        });

        this.#pages.unshift(formatPage);
    }

    /**
     * 카테고리를 추가합니다.
     *
     * @param {LocalCategory} category 카테고리 정보
     * @returns {void}
     */
    set putCategory(category) {
        const localCategory = this.#categories.get(category.name);

        if (localCategory) {
            for (const post of localCategory.postFilePaths) {
                category.addPostFilePath = post;
            }
        }

        this.#categories.set(category.name, category);
    }

    /**
     * 최신 카테고리 목록을 변경합니다.
     *
     * @param {ReadonlySet<string>} categories 카테고리 목록
     * @returns {void}
     */
    set updateLatestCategories(categories) {
        this.#latestCategories = categories;
    }

    /**
     * 최신 페이지 정보를 변경합니다.
     *
     * @param {LocalPage} page 페이지 정보
     * @returns {void}
     */
    set updateLatestPage(page) {
        this.#latestPage = page;
    }

    /**
     * 최신 게시글 정보를 변경합니다.
     *
     * @param {Post} post 게시글 정보
     * @returns {void}
     */
    set updateLatestPost(post) {
        this.#latestPost = post;
    }

    /**
     * 페이지 개수를 변경합니다.
     *
     * @param pageCount 페이지 개수
     * @returns {void}
     */
    set updatePageCount(pageCount) {
        this.#pageCount = pageCount;
    }

    /**
     * 게시글 개수를 변경합니다.
     *
     * @param postCount 게시글 개수
     * @returns {void}
     */
    set updatePostCount(postCount) {
        this.#postCount = postCount;
    }

    /**
     * @inheritDoc
     */
    toJSON() {
        /**
         * @type {LocalComprehensive}
         */
        const comprehensiveJSON = {};

        Object.defineProperties(comprehensiveJSON, {
            categories: {
                enumerable: true,
                value: Object.fromEntries(this.categories)
            },
            categoryCount: {
                enumerable: true,
                value: this.categoryCount
            },
            latestCategories: {
                enumerable: true,
                value: this.latestCategories
            },
            latestPage: {
                enumerable: true,
                value: this.latestPage
            },
            latestPost: {
                enumerable: true,
                value: this.latestPost
            },
            pageCount: {
                enumerable: true,
                value: this.pageCount
            },
            pages: {
                enumerable: true,
                value: this.pages
            },
            postCount: {
                enumerable: true,
                value: this.postCount
            },
        });

        return comprehensiveJSON;
    }

    static withDefault() {
        const comprehensive = structuredClone(defaultComprehensive);

        return new LocalComprehensive(comprehensive);
    }

}

/**
 * 로컬 카테고리 정보 클래스
 *
 * @implements Category
 * @implements {JSONSerializer<Category>}
 */
class LocalCategory {

    /**
     * 페이지 개수
     *
     * @type {number}
     */
    #count;

    /**
     * 카테고리명
     *
     * @type {string}
     */
    #name;

    /**
     * 게시글 파일 경로 목록
     *
     * @type {LocalFilePath[]}
     */
    #postFilePaths;

    /**
     * {@link LocalCategory} 클래스의 생성자
     *
     * @param {LocalCategory} otherCategory 다른 카테고리 메타데이터 정보
     */
    constructor(otherCategory) {
        this.#count = otherCategory.postFilePaths.length;
        this.#name = otherCategory.name;
        this.#postFilePaths = otherCategory.postFilePaths;
    }

    /**
     * 카테고리 개수를 반환합니다.
     *
     * @returns {number} 카테고리 개수
     */
    get count() {
        return this.#count;
    }

    /**
     * 카테고리명을 반환합니다.
     *
     * @returns {string} 카테고리명
     */
    get name() {
        return this.#name;
    }

    /**
     * 게시글 파일 경로 목록을 반환합니다.
     *
     * @returns {Readonly<FilePath>[]} 게시글 파일 경로 목록
     */
    get postFilePaths() {
        return this.#postFilePaths.map(postFilePath => nestedFreeze(postFilePath));
    }

    /**
     * 게시글 파일 경로를 추가합니다.
     *
     * @param {LocalFilePath} filePath
     */
    set addPostFilePath(filePath) {
        this.#count = this.count + 1;
        this.#postFilePaths.unshift(filePath);
    }

    /**
     * @inheritDoc
     */
    toJSON() {
        /**
         * @type {Category}
         */
        const categoryJSON = {};

        Object.defineProperties(categoryJSON, {
            count: {
                enumerable: true,
                value: this.count
            },
            name: {
                enumerable: true,
                value: this.name
            },
            postFilePaths: {
                enumerable: true,
                value: this.postFilePaths
            }
        });

        return categoryJSON;
    }

    static withDefault(categoryName) {
        const category = structuredClone(defaultCategory);

        Object.defineProperty(category, 'name', {
            value: categoryName
        });

        return new LocalCategory(category);
    }

}

/**
 * 파일 경로 클래스
 *
 * @implements {FilePath}
 * @implements {JSONSerializer<FilePath>}
 */
class LocalFilePath {

    #fileName;

    #folderPath;

    /**
     * {@link LocalFilePath} 클래스의 생성자
     *
     * @param {string} fileName 파일명
     * @param {string} folderPath 폴더 경로
     */
    constructor(fileName, folderPath) {
        this.#fileName = fileName;
        this.#folderPath = folderPath;
    }

    /**
     * 폴더 경로를 반환합니다.
     *
     * @returns {string} 폴더 경로
     */
    get folderPath() {
        return this.#folderPath;
    }

    /**
     * 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get fileName() {
        return this.#fileName;
    }

    /**
     * 전체 경로를 반환합니다.
     *
     * @returns {string} 전체 경로
     */
    get fullPath() {
        return path.join(this.#folderPath, this.#fileName);
    }

    /**
     * @inheritDoc
     * @returns {FilePath} 파일 경로 JSON
     */
    toJSON() {
        const filePathJSON = {};

        Object.defineProperties(filePathJSON, {
            fileName: {
                enumerable: true,
                value: this.fileName
            },
            folderPath: {
                enumerable: true,
                value: this.folderPath
            },
            fullPath: {
                enumerable: true,
                value: this.fullPath
            }
        });

        return filePathJSON;
    }

    /**
     * 게시글로부터 파일 경로를 생성합니다.
     *
     * @param {Post} post 게시글 정보
     * @returns {FilePath} 게시글 파일 경로
     */
    static fromPost(post) {
        const fileName = post.fileName;
        const folderPath = post.folderPath;

        return new LocalFilePath(fileName, folderPath);
    }

}

/**
 * 페이지 메타데이터 클래스
 *
 * @implements {JSONSerializer<Page>}
 * @implements {Page}
 */
class LocalPage {

    /**
     * 페이지 파일명
     *
     * @type {string}
     */
    #fileName;

    /**
     * 페이지 폴더 경로
     *
     * @type {string}
     */
    #folderPath;

    /**
     * 게시글 목록
     *
     * @type {LocalPost[]}
     */
    #posts;

    /**
     * {@link LocalPage} 클래스의 생성자
     *
     * @param {LocalPage} otherPage 다른 페이지 정보
     */
    constructor(otherPage) {
        this.#fileName = otherPage.fileName;
        this.#folderPath = otherPage.folderPath;
        this.#posts = otherPage.posts;
    }

    /**
     * 페이지 파일명을 반환합니다.
     *
     * @returns {string} 페이지 파일명
     */
    get fileName() {
        return this.#fileName;
    }

    /**
     * 페이지 파일 경로를 반환합니다.
     *
     * @returns {string} 페이지 파일 경로
     */
    get folderPath() {
        return this.#folderPath;
    }

    /**
     * 페이지 파일의 전체 경로를 반환합니다.
     *
     * @returns {string} 페이지 파일의 전체 경로
     */
    get fullPath() {
        return path.join(this.#folderPath, this.#fileName);
    }

    /**
     * 게시글 목록을 반환합니다.
     *
     * @returns {Readonly<Post[]>} 게시글 목록
     */
    get posts() {
        return Array.from(this.#posts);
    }

    /**
     * 게시글 개수를 반환합니다.
     *
     * @returns {number} 게시글 개수
     */
    get postCount() {
        return this.#posts.length;
    }

    /**
     * 게시글을 추가합니다.
     *
     * @param {LocalPost} post 게시글
     */
    set addPost(post) {
        this.#posts.unshift(post);
    }

    /**
     * @inheritDoc
     */
    toJSON() {
        /**
         * @type {Page}
         */
        const pageJSON = {};

        Object.defineProperties(pageJSON, {
            fileName: {
                enumerable: true,
                value: this.fileName
            },
            folderPath: {
                enumerable: true,
                value: this.folderPath
            },
            fullPath: {
                enumerable: true,
                value: this.fullPath
            },
            posts: {
                enumerable: true,
                value: this.posts
            },
            postCount: {
                enumerable: true,
                value: this.postCount
            }
        });

        return pageJSON;
    }

    static withDefault(folderPath) {
        const page = structuredClone(defaultPage);

        Object.defineProperties(page, {
            fileName: {
                value: uuid.v7() + '.page.json'
            },
            folderPath: {
                value: folderPath
            }
        });

        return new LocalPage(page);
    }

}

/**
 * 게시글 메타데이터 클래스
 *
 * @implements {JSONSerializer<Post>}
 * @implements {Post}
 */
class LocalPost {

    /**
     * 카테고리 목록
     *
     * @type {Set<string>}
     */
    #categories;

    /**
     * 게시글 파일명
     *
     * @type {string}
     */
    #fileName;

    /**
     * 게시글 파일 경로
     *
     * @type {string}
     */
    #folderPath;

    /**
     * 게시글 생성 파일명
     *
     * @type {string}
     */
    #generateFileName;

    /**
     * 게시글 요약 정보
     *
     * @type {string}
     */
    #summation;

    /**
     * 게시글 썸네일
     *
     * @type {LocalThumbnail}
     */
    #thumbnail;

    /**
     * 게시글 제목
     *
     * @type {string}
     */
    #title;

    /**
     * 게시글 작성일자
     *
     * @type {ISODateTime}
     */
    #writeDateTime;

    /**
     * {@link LocalPost} 클래스의 생성자
     *
     * @param {LocalPost} otherPost 다른 게시글 정보
     */
    constructor(otherPost) {
        this.#categories = otherPost.categories;
        this.#fileName = otherPost.fileName;
        this.#folderPath = otherPost.folderPath;
        this.#generateFileName = otherPost.generateFileName;
        this.#summation = otherPost.summation;
        this.#thumbnail = otherPost.thumbnail;
        this.#title = otherPost.title;
        this.#writeDateTime = otherPost.writeDateTime;
    }

    /**
     * 카테고리 목록을 반환합니다.
     *
     * @returns {ReadonlySet<string>} 카테고리 목록
     */
    get categories() {
        return this.#categories;
    }

    /**
     * 게시글 파일명을 반환합니다.
     *
     * @returns {string} 게시글 파일명
     */
    get fileName() {
        return this.#fileName;
    }

    /**
     * 게시글 폴더 경로를 반환합니다.
     *
     * @returns {string} 게시글 폴더 경로
     */
    get folderPath() {
        return this.#folderPath;
    }

    /**
     * 게시글 파일의 전체 경로를 반환합니다.
     *
     * @returns {string} 게시글 파일의 전체 경로
     */
    get fullPath() {
        return path.join(this.#folderPath, this.#fileName);
    }

    /**
     * 게시글 생성 파일명을 반환합니다.
     *
     * @returns {string} 게시글 생성 파일명
     */
    get generateFileName() {
        return this.#generateFileName;
    }

    /**
     * 게시글 요약 정보를 반환합니다.
     *
     * @returns {string} 게시글 요약 정보
     */
    get summation() {
        return this.#summation;
    }

    /**
     * 게시글 썸네일을 반환합니다.
     *
     * @returns {Thumbnail} 게시글 썸네일
     */
    get thumbnail() {
        return this.#thumbnail;
    }

    /**
     * 게시글 제목을 반환합니다.
     *
     * @returns {string} 게시글 제목
     */
    get title() {
        return this.#title;
    }

    /**
     * 게시글 작성일자를 반환합니다.
     *
     * @returns {ISODateTime} 게시글 작성일자
     */
    get writeDateTime() {
        return this.#writeDateTime;
    }

    /**
     * @inheritDoc
     */
    toJSON() {
        /**
         * @type {Post}
         */
        const postJSON = {};

        Object.defineProperties(postJSON, {
            categories: {
                enumerable: true,
                value: this.categories
            },
            fileName: {
                enumerable: true,
                value: this.fileName
            },
            folderPath: {
                enumerable: true,
                value: this.folderPath
            },
            fullPath: {
                enumerable: true,
                value: this.fullPath
            },
            summation: {
                enumerable: true,
                value: this.summation
            },
            thumbnail: {
                enumerable: true,
                value: this.thumbnail
            },
            title: {
                enumerable: true,
                value: this.title
            },
            writeDateTime: {
                enumerable: true,
                value: this.writeDateTime
            }
        });

        return postJSON;
    }

}

/**
 * 썸네일 메타데이터 클래스s
 *
 * @implements {JSONSerializer<Thumbnail>}
 * @implements {Thumbnail}
 */
class LocalThumbnail {

    /**
     * 대체 썸네일 파일명
     *
     * @type {string}
     */
    #alternativeFileName;

    /**
     * 썸네일 설명 텍스트
     *
     * @type {string}
     */
    #explanatoryText;

    /**
     * 썸네일 파일명
     *
     * @type {string}
     */
    #fileName;

    /**
     * 썸네일 폴더명
     *
     * @type {string}
     */
    #folderName;

    /**
     * {@link LocalThumbnail} 클래스의 생성자
     *
     * @param {LocalThumbnail} otherThumbnail 다른 썸네일 정보
     */
    constructor(otherThumbnail) {
        this.#alternativeFileName = otherThumbnail.alternativeFileName;
        this.#explanatoryText = otherThumbnail.explanatoryText;
        this.#fileName = otherThumbnail.fileName;
        this.#folderName = otherThumbnail.folderPath;
    }

    /**
     * 대체 썸네일 파일명을 반환합니다.
     *
     * @returns {string} 대체 썸네일 파일명
     */
    get alternativeFileName() {
        return this.#alternativeFileName;
    }

    /**
     * 썸네일 설명 텍스트를 반환합니다.
     *
     * @returns {string} 썸네일 설명 텍스트
     */
    get explanatoryText() {
        return this.#explanatoryText;
    }

    /**
     * 썸네일 파일명을 반환합니다.
     *
     * @override
     * @returns {string} 썸네일 파일명
     */
    get fileName() {
        return this.#fileName;
    }

    /**
     * 썸네일 폴더 경로를 반환합니다.
     *
     * @returns {string} 썸네일 폴더명
     */
    get folderPath() {
        return this.#folderName;
    }

    /**
     * 썸네일 파일의 전체 경로를 반환합니다.
     *
     * @returns {string} 썸네일 파일 전체 경로
     */
    get fullPath() {
        return path.join(this.#folderName, this.#fileName);
    }

    /**
     * @inheritDoc
     */
    toJSON() {
        /**
         * @type {Thumbnail}
         */
        const thumbnailJSON = {};

        Object.defineProperties(thumbnailJSON, {
            alternativeFileName: {
                enumerable: true,
                value: this.alternativeFileName
            },
            explanatoryText: {
                enumerable: true,
                value: this.explanatoryText
            },
            fileName: {
                enumerable: true,
                value: this.fileName
            },
            folderPath: {
                enumerable: true,
                value: this.folderPath
            }
        });

        return thumbnailJSON;
    }

}

/**
 * @template T
 * @implements {Serializer<Thumbnail, T>}
 */
class ThumbnailSerializer {

    /**
     * @inheritDoc
     */
    serialize(target) {
        const prototype = Object.getPrototypeOf(target);
        const descriptors = Object.getOwnPropertyDescriptors(prototype);

        for (const propertyName in descriptors) {
            const descriptor = descriptors[propertyName];
        };
    }

}

export {
    LocalComprehensive,
    LocalCategory,
    LocalFilePath,
    LocalPage,
    LocalPost,
    LocalThumbnail
};
