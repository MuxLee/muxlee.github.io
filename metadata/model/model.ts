import path from 'path';
import * as uuid from 'uuid';

import type { FilePath, Nullable } from '@script/util/util';
import { ObjectDefiners, nestedFreeze } from '@script/util/util';

/**
 * 카테고리 정보를 관리하는 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface Category {

    /**
     * 카테고리 개수를 반환합니다.
     *
     * @returns {number} 카테고리 개수
     */
    get count(): number;

    /**
     * 카테고리명을 반환합니다.
     *
     * @returns {string} 카테고리명
     */
    get name(): string;

    /**
     * 게시글 메타데이터 목록을 반환합니다.
     *
     * @returns {FilePath[]} 메타데이터 목록
     */
    get postFilePaths(): FilePath[];

}

/**
 * 페이지와 카테고리, 게시글들에 대한 포괄적인 정보를 담당하는 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface Comprehensive {

    /**
     * 카테고리 메타데이터 목록을 반환합니다.
     *
     * @returns {ReadonlyMap<string, Category>} 메타데이터 목록
     */
    get categories(): ReadonlyMap<string, Category>;

    /**
     * 카테고리의 개수를 반환합니다.
     *
     * @returns {number} 카테고리 개수
     */
    get categoryCount(): number;

    /**
     * 최신 카테고리명 목록을 반환합니다.
     *
     * @returns {string[]} 카테고리명 목록
     */
    get latestCategories(): string[];

    /**
     * 최신 페이지 메타데이터를 반환합니다.
     *
     * @returns {Nullable<Page>} 페이지 메타데이터
     */
    get latestPage(): Nullable<FilePath>;

    /**
     * 최신 게시글 메타데이터를 반환합니다.
     *
     * @returns {Nullable<Post>} 게시글 메타데이터
     */
    get latestPost(): Nullable<FilePath>;

    /**
     * 페이지의 개수를 반환합니다.
     *
     * @returns {number} 페이지 개수
     */
    get pageCount(): number;

    /**
     * 페이지 메타데이터 목록을 반환합니다.
     *
     * @returns {Pages[]} 페이지 메타데이터 목록
     */
    get pages(): FilePath[];

    /**
     * 게시글 개수를 반환합니다.
     *
     * @returns {number} 게시글 개수
     */
    get postCount(): number;

}

/**
 * 'YYYY-MM-DD' 형태의 ISO 날짜 정보 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type ISODate = `${string}-${string}-${string}`;

/**
 * 'YYYY-MM-DD HH:mm:ss.SSS' 형태의 ISO 날짜 및 시간 정보 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type ISODateTime = `${ISODate} ${ISOTime}`;

/**
 * 'HH:mm:ss.SSS' 형태의 ISO 시간 정보 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type ISOTime = `${string}:${string}:${string}.${string}`;

/**
 * 게시글 정보를 정해진 개수로 관리하는 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface Page extends FilePath {

    /**
     * 다음 페이지 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 페이지 메타데이터
     */
    get nextPage(): Nullable<FilePath>;

    /**
     * 게시글 메타데이터 목록을 반환합니다.
     *
     * @returns {FilePath[]} 메타데이터 목록
     */
    get posts(): FilePath[];

    /**
     * 게시글 개수를 반환합니다.
     *
     * @returns {number} 게시글 개수
     */
    get postCount(): number;

    /**
     * 이전 페이지 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 페이지 메타데이터
     */
    get previousPage(): Nullable<FilePath>;

}

/**
 * 게시글 정보를 관리하는 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface Post extends FilePath {

    /**
     * 카테고리명 목록을 반환합니다.
     *
     * @returns {string[]} 카테고리명 목록
     */
    get categories(): string[]

    /**
     * 다음 게시글 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 게시글 메타데이터
     */
    get nextPost(): Nullable<FilePath>;

    /**
     * 이전 게시글 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 게시글 메타데이터
     */
    get previousPost(): Nullable<FilePath>;

    /**
     * 게시글을 요약한 내용을 반환합니다.
     *
     * @returns {string} 요약 내용
     */
    get summation(): string;

    /**
     * 썸네일 메타데이터를 반환합니다.
     *
     * @returns {Thumbnail} 썸네일 메타데이터
     */
    get thumbnail(): Thumbnail;

    /**
     * 게시글 제목을 반환합니다.
     *
     * @returns {string} 제목
     */
    get title(): string;

    /**
     * 게시글 작성일자를 반환합니다.
     *
     * @returns {ISODateTime} 작성일자
     */
    get writeDateTime(): ISODateTime;

}

/**
 * 썸네일 정보를 관리하는 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface Thumbnail extends FilePath {

    /**
     * 대체 썸네일 파일명을 반환합니다.
     *
     * @returns {string} 대체 파일명
     */
    get alternativeFileName(): string;

    /**
     * 썸네일을 설명하는 내용을 반환합니다.
     *
     * @returns {string} 설명 내용
     */
    get explanatoryText(): string;

}

/**
 * 기본 카테고리 메타데이터
 *
 * @type {Category}
 */
const defaultCategory: Category = {
    count: 0,
    name: '',
    postFilePaths: []
};

/**
 * 기본 종합 메타데이터
 *
 * @type {Comprehensive}
 */
const defaultComprehensive: Comprehensive = {
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
 * 기본 페이지 메타데이터
 *
 * @type {Page}
 */
const defaultPage: Page = {
    fileName: uuid.MAX + '.page.json',
    folderPath: '',
    fullPath: '',
    nextPage: null,
    posts: [],
    postCount: 0,
    previousPage: null
};

/**
 * 카테고리 메타데이터 클래스
 *
 * @implements {Category}
 * @author Mux
 * @version 1.0.0
 */
class LocalCategory implements Category {

    /**
     * 페이지 개수
     *
     * @type {number}
     */
    #count: number;

    /**
     * 카테고리명
     *
     * @type {string}
     */
    #name: string;

    /**
     * 게시글 파일 경로 목록
     *
     * @type {FilePath[]}
     */
    #postFilePaths: FilePath[];

    /**
     * {@link LocalCategory} 클래스의 생성자
     *
     * @param {Category} category 카테고리 메타데이터
     */
    constructor(category: Category) {
        this.#count = category.postFilePaths.length;
        this.#name = category.name;
        this.#postFilePaths = category.postFilePaths;
    }

    /**
     * 카테고리 개수를 반환합니다.
     *
     * @returns {number} 카테고리 개수
     */
    get count(): number {
        return this.#count;
    }

    /**
     * 카테고리명을 반환합니다.
     *
     * @returns {string} 카테고리명
     */
    get name(): string {
        return this.#name;
    }

    /**
     * 게시글 파일 경로 목록을 반환합니다.
     *
     * @returns {Readonly<FilePath>[]} 파일 경로 목록
     */
    get postFilePaths(): Readonly<FilePath>[] {
        return this.#postFilePaths.map(postFilePath => nestedFreeze(postFilePath));
    }

    /**
     * 게시글 파일 경로를 추가합니다.
     *
     * @param {FilePath} filePath 파일 경로
     */
    set addPostFilePath(filePath: FilePath) {
        this.#count = this.count + 1;
        this.#postFilePaths.unshift(filePath);
    }

    /**
     * JSON으로 변환하여 반환합니다.
     * 
     * @returns {object} JSON
     */
    toJSON(): object {
        return ObjectDefiners.onlyWereEnumerable({}, {
            count: this.count,
            name: this.name,
            postFilePaths: this.postFilePaths
        });
    }

    /**
     * 기본 카테고리 메타데이터를 반환합니다.
     * 
     * @param {string} categoryName 카테고리명
     * @returns {LocalCategory} 기본 카테고리 메타데이터
     */
    static withDefault(categoryName: string): LocalCategory {
        const clonedCategory = structuredClone(defaultCategory)
        const category = ObjectDefiners.onlyEnumerable(clonedCategory, 'name', categoryName);

        return new LocalCategory(category);
    }

}

/**
 * 종합 메타데이터 클래스
 *
 * @implements {Comprehensive}
 * @author Mux
 * @version 1.0.0
 */
class LocalComprehensive implements Comprehensive {

    /**
     * 카테고리 메타데이터 목록
     *
     * @type {Map<string, Category>}
     */
    #categories: Map<string, Category>;

    /**
     * 최신 카테고리명 목록
     *
     * @type {Set<string>}
     */
    #latestCategories: Set<string>;

    /**
     * 최신 페이지 메타데이터
     *
     * @type {Nullable<FilePath>}
     */
    #latestPage: Nullable<FilePath>;

    /**
     * 최신 게시글 메타데이터
     *
     * @type {Nullable<FilePath>}
     */
    #latestPost: Nullable<FilePath>;

    /**
     * 페이지 개수
     *
     * @type {number}
     */
    #pageCount: number;

    /**
     * 페이지 메타데이터 목록
     *
     * @type {FilePath[]}
     */
    #pages: FilePath[];

    /**
     * 게시글 개수
     *
     * @type {number}
     */
    #postCount: number;

    /**
     * {@link LocalComprehensive} 클래스 생성자
     *
     * @param {Comprehensive} comprehensive 종합 메타데이터
     */
    constructor(comprehensive: Comprehensive) {
        this.#categories = new Map(
            Object.entries(comprehensive.categories)
        );
        this.#latestCategories = new Set(comprehensive.latestCategories);
        this.#latestPage = comprehensive.latestPage;
        this.#latestPost = comprehensive.latestPost;
        this.#pageCount = comprehensive.pageCount;
        this.#pages = comprehensive.pages;
        this.#postCount = comprehensive.postCount;
    }

    /**
     * 카테고리 메타데이터 목록을 반환합니다.
     *
     * @returns {Map<string, Category>} 메타데이터 목록
     */
    get categories(): Map<string, Category> {
        return this.#categories;
    }

    /**
     * 카테고리 개수를 반환합니다.
     *
     * @returns {number} 카테고리 개수
     */
    get categoryCount(): number {
        return this.#categories.size;
    }

    /**
     * 최신 카테고리 목록을 반환합니다.
     *
     * @returns {string[]} 카테고리 목록
     */
    get latestCategories(): string[] {
        return Array.from(this.#latestCategories);
    }

    /**
     * 최신 페이지 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 페이지 메타데이터
     */
    get latestPage(): Nullable<FilePath> {
        if (this.#latestPage) {
            const latestPage = global.structuredClone(this.#latestPage);

            return latestPage;
        }

        return null;
    }

    /**
     * 최신 게시글 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 게시글 메타데이터
     */
    get latestPost(): Nullable<FilePath> {
        if (this.#latestPost) {
            const latestPost = global.structuredClone(this.#latestPost);

            return latestPost;
        }

        return null;
    }

    /**
     * 페이지 개수를 반환합니다.
     *
     * @returns {number} 페이지 개수
     */
    get pageCount(): number {
        return this.#pageCount;
    }

    /**
     * 페이지 메타데이터 목록을 반환합니다.
     *
     * @returns {FilePath[]} 메타데이터 목록
     */
    get pages(): FilePath[] {
        return this.#pages;
    }

    /**
     * 게시글 개수를 반환합니다.
     *
     * @returns {number} 게시글 개수
     */
    get postCount(): number {
        return this.#postCount;
    }

    /**
     * 페이지 메타데이터를 추가합니다.
     *
     * @param {FilePath} page 페이지 메타데이터
     */
    set addPage(page: FilePath) {
        this.#pages.unshift(page);
    }

    /**
     * 최신 카테고리명 목록을 변경합니다.
     *
     * @param {string[]} categories 카테고리명 목록
     */
    set updateLatestCategories(categories: string[]) {
        this.#latestCategories = new Set(categories);
    }

    /**
     * 최신 페이지 메타데이터를 변경합니다.
     *
     * @param {FilePath} page 페이지 메타데이터
     */
    set updateLatestPage(page: FilePath) {
        this.#latestPage = page;
    }

    /**
     * 최신 게시글 메타데이터를 변경합니다.
     *
     * @param {FilePath} post 게시글 메타데이터
     */
    set updateLatestPost(post: FilePath) {
        this.#latestPost = post;
    }

    /**
     * 페이지 개수를 변경합니다.
     *
     * @param {number} pageCount 페이지 개수
     */
    set updatePageCount(pageCount: number) {
        this.#pageCount = pageCount;
    }

    /**
     * 게시글 개수를 변경합니다.
     *
     * @param {number} postCount 게시글 개수
     */
    set updatePostCount(postCount: number) {
        this.#postCount = postCount;
    }

    /**
     * 카테고리를 추가합니다.
     *
     * @param {string} categoryName 카테고리명
     * @param {FilePath} filePath 파일 경로
     * @returns {void}
     */
    putCategory(categoryName: string, filePath: FilePath): void {
        const localCategory = this.#categories.get(categoryName);
        const category = localCategory
            ? new LocalCategory(localCategory)
            : LocalCategory.withDefault(categoryName);

        category.addPostFilePath = filePath;
        this.#categories.set(categoryName, category);
    }

    /**
     * JSON으로 변환하여 반환합니다.
     * 
     * @returns {object} JSON
     */
    toJSON(): object {
        return ObjectDefiners.onlyWereEnumerable({}, {
            categories: global.Object.fromEntries(this.categories),
            categoryCount: this.categoryCount,
            latestCategories: this.#latestCategories,
            latestPage: this.#latestPage,
            latestPost: this.#latestPost,
            pageCount: this.pageCount,
            pages: this.pages,
            postCount: this.postCount
        });
    }

    /**
     * 기본 종합 메타데이터를 반환합니다.
     * 
     * @returns {LocalComprehensive} 기본 종합 메타데이터
     */
    static withDefault(): LocalComprehensive {
        const comprehensive = structuredClone(defaultComprehensive);

        return new LocalComprehensive(comprehensive);
    }

}

/**
 * 파일 경로 메타데이터 클래스
 *
 * @implements {FilePath}
 * @author Mux
 * @version 1.0.0
 */
class LocalFilePath implements FilePath {

    /**
     * 파일명
     * 
     * @type {string}
     */
    #fileName: string;

    /**
     * 폴더 경로
     * 
     * @type {string}
     */
    #folderPath: string;

    /**
     * {@link LocalFilePath} 클래스의 생성자
     *
     * @param {string} fileName 파일명
     * @param {string} folderPath 폴더 경로
     */
    constructor(fileName: string, folderPath: string) {
        this.#fileName = fileName;
        this.#folderPath = folderPath;
    }

    /**
     * 폴더 경로를 반환합니다.
     *
     * @returns {string} 폴더 경로
     */
    get folderPath(): string {
        return this.#folderPath;
    }

    /**
     * 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get fileName(): string {
        return this.#fileName;
    }

    /**
     * 전체 경로를 반환합니다.
     *
     * @returns {string} 전체 경로
     */
    get fullPath(): string {
        return path.join(this.#folderPath, this.#fileName);
    }

    /**
     * JSON으로 변환하여 반환합니다.
     * 
     * @returns {object} JSON
     */
    toJSON(): object {
        return ObjectDefiners.onlyWereEnumerable({}, {
            fileName: this.fileName,
            folderPath: this.folderPath,
            fullPath: this.fullPath
        });
    }

}

/**
 * 페이지 메타데이터 클래스
 *
 * @implements {Page}
 * @author Mux
 * @version 1.0.0
 */
class LocalPage implements Page {

    /**
     * 페이지 파일명
     *
     * @type {string}
     */
    #fileName: string;

    /**
     * 페이지 폴더 경로
     *
     * @type {string}
     */
    #folderPath: string;

    /**
     * 다음 페이지 메타데이터
     *
     * @type {Nullable<FilePath>}
     */
    #nextPage: Nullable<FilePath>;

    /**
     * 이전 페이지 메타데이터
     *
     * @type {Nullable<FilePath>}
     */
    #previousPage: Nullable<FilePath>;

    /**
     * 게시글 메타데이터 목록
     *
     * @type {FilePath[]}
     */
    #posts: FilePath[];

    /**
     * {@link LocalPage} 클래스의 생성자
     *
     * @param {Page} page 페이지 메타데이터
     */
    constructor(page: Page) {
        this.#fileName = page.fileName;
        this.#folderPath = page.folderPath;
        this.#nextPage = page.nextPage;
        this.#previousPage = page.previousPage;
        this.#posts = page.posts;
    }

    /**
     * 페이지 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get fileName(): string {
        return this.#fileName;
    }

    /**
     * 페이지 파일 경로를 반환합니다.
     *
     * @returns {string} 파일 경로
     */
    get folderPath(): string {
        return this.#folderPath;
    }

    /**
     * 페이지 파일의 전체 경로를 반환합니다.
     *
     * @returns {string} 전체 경로
     */
    get fullPath(): string {
        return path.join(this.#folderPath, this.#fileName);
    }

    /**
     * 다음 페이지 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 페이지 메타데이터
     */
    get nextPage(): Nullable<FilePath> {
        return this.#nextPage;
    }

    /**
     * 게시글 메타데이터 목록을 반환합니다.
     *
     * @returns {FilePath[]} 메타데이터 목록
     */
    get posts(): FilePath[] {
        return this.#posts;
    }

    /**
     * 게시글 개수를 반환합니다.
     *
     * @returns {number} 게시글 개수
     */
    get postCount(): number {
        return this.#posts.length;
    }

    /**
     * 이전 페이지 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 페이지 메타데이터
     */
    get previousPage(): Nullable<FilePath> {
        return this.#previousPage;
    }

    /**
     * 게시글 메타데이터를 추가합니다.
     *
     * @param {Post} post 게시글 메타데이터
     */
    set addPost(post: Post) {
        this.#posts.unshift(post);
    }

    /**
     * 파일명을 설정합니다.
     * 
     * @param {string} fileName 파일명
     */
    set fileName(fileName: string) {
        this.#fileName = fileName;
    }

    /**
     * 폴더 경로를 설정합니다.
     * 
     * @param {string} folderPath 폴더 경로
     */
    set folderPath(folderPath: string) {
        this.#folderPath = folderPath;
    }

    /**
     * 다음 페이지 메타데이터를 변경합니다.
     *
     * @param {FilePath} page 페이지 메타데이터
     */
    set updateNextPage(page: FilePath) {
        this.#nextPage = page;
    }

    /**
     * 이전 페이지 메타데이터를 변경합니다.
     *
     * @param {FilePath} page 페이지 메타데이터
     */
    set updatePreviousPage(page: FilePath) {
        this.#previousPage = page;
    }

    /**
     * JSON으로 변환하여 반환합니다.
     * 
     * @returns {object} JSON
     */
    toJSON(): object {
        return ObjectDefiners.onlyWereEnumerable({}, {
            fileName: this.fileName,
            folderPath: this.folderPath,
            fullPath: this.fullPath,
            nextPage: this.nextPage,
            previousPage: this.previousPage,
            posts: this.posts,
            postCount: this.postCount
        });
    }

    /**
     * 기본 페이지 메타데이터를 반환합니다.
     *
     * @param {string} folderPath 폴더 경로
     * @returns {LocalPage} 페이지 정보
     */
    static withDefault(folderPath: string): LocalPage {
        const page = ObjectDefiners.onlyWereEnumerable(
            structuredClone(defaultPage),
            {
                fileName: uuid.v7() + '.page.json',
                folderPath
            }
        );

        return new LocalPage(page);
    }

}

/**
 * 게시글 메타데이터 클래스
 *
 * @implements {Post}
 * @author Mux
 * @version 1.0.0
 */
class LocalPost implements Post {

    /**
     * 카테고리명 목록
     *
     * @type {Set<string>}
     */
    #categories: Set<string>;

    /**
     * 게시글 파일명
     *
     * @type {string}
     */
    #fileName: string;

    /**
     * 게시글 파일 경로
     *
     * @type {string}
     */
    #folderPath: string;

    /**
     * 다음 게시글 메타데이터
     *
     * @type {Nullable<FilePath>}
     */
    #nextPost: Nullable<FilePath>;

    /**
     * 게시글 원본 파일명
     * 
     * @type {string}
     */
    #originalFileName: string;

    /**
     * 이전 게시글 메타데이터
     *
     * @type {Nullable<FilePath>}
     */
    #previousPost: Nullable<FilePath>;

    /**
     * 게시글 요약 정보
     *
     * @type {string}
     */
    #summation: string;

    /**
     * 썸네일 메타데이터
     *
     * @type {Thumbnail}
     */
    #thumbnail: Thumbnail;

    /**
     * 게시글 제목
     *
     * @type {string}
     */
    #title: string;

    /**
     * 게시글 작성일자
     *
     * @type {ISODateTime}
     */
    #writeDateTime: ISODateTime;

    /**
     * {@link LocalPost} 클래스의 생성자
     *
     * @param {Post} post 게시글 메타데이터
     */
    constructor(post: Post) {
        this.#categories = new Set(post.categories);
        this.#fileName = post.fileName;
        this.#folderPath = post.folderPath;
        this.#nextPost = post.nextPost;
        this.#originalFileName = post.fileName;
        this.#previousPost = post.previousPost;
        this.#summation = post.summation;
        this.#thumbnail = post.thumbnail;
        this.#title = post.title;
        this.#writeDateTime = post.writeDateTime;
    }

    /**
     * 카테고리명 목록을 반환합니다.
     *
     * @returns {string[]} 카테고리명 목록
     */
    get categories(): string[] {
        return Array.from(this.#categories);
    }

    /**
     * 게시글 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get fileName(): string {
        return this.#fileName;
    }

    /**
     * 게시글 폴더 경로를 반환합니다.
     *
     * @returns {string} 폴더 경로
     */
    get folderPath(): string {
        return this.#folderPath;
    }

    /**
     * 게시글 파일의 전체 경로를 반환합니다.
     *
     * @returns {string} 전체 경로
     */
    get fullPath(): string {
        return path.join(this.#folderPath, this.#fileName);
    }

    /**
     * 다음 게시글 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 게시글 메타데이터
     */
    get nextPost(): Nullable<FilePath> {
        return this.#nextPost;
    }

    /**
     * 게시글 원본 파일명을 반환합니다.
     * 
     * @returns {string} 원본 파일명
     */
    get originalFileName(): string {
        return this.#originalFileName;
    }

    /**
     * 이전 게시글 메타데이터를 반환합니다.
     *
     * @returns {Nullable<FilePath>} 게시글 메타데이터
     */
    get previousPost(): Nullable<FilePath> {
        return this.#previousPost;
    }

    /**
     * 게시글 요약 정보를 반환합니다.
     *
     * @returns {string} 요약 정보
     */
    get summation(): string {
        return this.#summation;
    }

    /**
     * 썸네일 메타데이터를 반환합니다.
     *
     * @returns {Thumbnail} 썸네일 메타데이터
     */
    get thumbnail(): Thumbnail {
        return this.#thumbnail;
    }

    /**
     * 게시글 제목을 반환합니다.
     *
     * @returns {string} 제목
     */
    get title(): string {
        return this.#title;
    }

    /**
     * 게시글 작성일자를 반환합니다.
     *
     * @returns {ISODateTime} 작성일자
     */
    get writeDateTime(): ISODateTime {
        return this.#writeDateTime;
    }

    /**
     * 파일명을 설정합니다.
     * 
     * @param {string} fileName 파일명
     */
    set fileName(fileName: string) {
        this.#fileName = fileName;
    }

    /**
     * 폴더 경로를 설정합니다.
     * 
     * @param {string} folderPath 폴더 경로
     */
    set folderPath(folderPath: string) {
        this.#folderPath = folderPath;
    }

    /**
     * 원본 파일명을 설정합니다.
     * 
     * @param {string} originalFileName 원본 파일명
     */
    set originalFileName(originalFileName: string) {
        this.#originalFileName = originalFileName;
    }

    /**
     * 다음 게시글 메타데이터를 변경합니다.
     *
     * @param {FilePath} post 게시글 메타데이터
     */
    set updateNextPost(post: FilePath) {
        this.#nextPost = post
    }

    /**
     * 이전 게시글 메타데이터를 변경합니다.
     *
     * @param {FilePath} post 게시글 메타데이터
     */
    set updatePreviousPost(post: FilePath) {
        this.#previousPost = post;
    }

    /**
     * JSON으로 변환하여 반환합니다.
     * 
     * @returns {object} JSON
     */
    toJSON(): object {
        return ObjectDefiners.onlyWereEnumerable({}, {
            categories: this.categories,
            fileName: this.fileName,
            folderPath: this.folderPath,
            fullPath: this.fullPath,
            nextPost: this.nextPost,
            previousPost: this.previousPost,
            summation: this.summation,
            thumbnail: this.thumbnail,
            title: this.title,
            writeDateTime: this.writeDateTime
        });
    }

}

/**
 * 썸네일 메타데이터 클래스
 *
 * @implements {Thumbnail}
 * @author Mux
 * @version 1.0.0
 */
class LocalThumbnail implements Thumbnail {

    /**
     * 대체 썸네일 파일명
     *
     * @type {string}
     */
    #alternativeFileName: string;

    /**
     * 썸네일 설명 텍스트
     *
     * @type {string}
     */
    #explanatoryText: string;

    /**
     * 썸네일 파일명
     *
     * @type {string}
     */
    #fileName: string;

    /**
     * 썸네일 폴더명
     *
     * @type {string}
     */
    #folderName: string;

    /**
     * {@link LocalThumbnail} 클래스의 생성자
     *
     * @param {Thumbnail} thumbnail 썸네일 메타데이터
     */
    constructor(thumbnail: Thumbnail) {
        this.#alternativeFileName = thumbnail.alternativeFileName;
        this.#explanatoryText = thumbnail.explanatoryText;
        this.#fileName = thumbnail.fileName;
        this.#folderName = thumbnail.folderPath;
    }

    /**
     * 대체 썸네일 파일명을 반환합니다.
     *
     * @returns {string} 대체 파일명
     */
    get alternativeFileName(): string {
        return this.#alternativeFileName;
    }

    /**
     * 썸네일 설명 텍스트를 반환합니다.
     *
     * @returns {string} 설명 텍스트
     */
    get explanatoryText(): string {
        return this.#explanatoryText;
    }

    /**
     * 썸네일 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get fileName(): string {
        return this.#fileName;
    }

    /**
     * 썸네일 폴더 경로를 반환합니다.
     *
     * @returns {string} 폴더 경로
     */
    get folderPath(): string {
        return this.#folderName;
    }

    /**
     * 썸네일 파일의 전체 경로를 반환합니다.
     *
     * @returns {string} 파일 전체 경로
     */
    get fullPath(): string {
        return path.join(this.#folderName, this.#fileName);
    }

    /**
     * JSON으로 변환하여 반환합니다.
     * 
     * @returns {object} JSON
     */
    toJSON(): object {
        return ObjectDefiners.onlyWereEnumerable({}, {
            alternativeFileName: this.alternativeFileName,
            explanatoryText: this.explanatoryText,
            fileName: this.fileName,
            folderPath: this.folderPath,
            fullPath: this.fullPath
        });
    }

}

export type {
    Category,
    Comprehensive,
    FilePath,
    ISODate,
    ISODateTime,
    ISOTime,
    Page,
    Post,
    Thumbnail
};

export {
    LocalComprehensive,
    LocalCategory,
    LocalFilePath,
    LocalPage,
    LocalPost,
    LocalThumbnail
};