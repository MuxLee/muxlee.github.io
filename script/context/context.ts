import path from 'path';

import type { BlobGrant } from '@script/blob/blob';

/**
 * 정보 인터페이스
 *
 * @author Mux
 * @version 1.0.0
 */
interface Context {

    /**
     * 정보 고유명 반환합니다.
     *
     * @returns {string} 정보 고유명
     */
    get contextName(): string;

}

/**
 * 정보 생성 인터페이스
 *
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface ContextFactory<T> {

    /**
     * 정보를 생성하여 반환합니다.
     *
     * @template {Context | Context[]} R 반환 정보 유형
     * @param {T} value 개체
     * @returns {R} 정보
     */
    factory<R extends Context | Context[]>(value: T): R;

}

/**
 * 폴더 정보 인터페이스
 *
 * @extends {Context}
 * @author Mux
 * @version 1.0.0
 */
interface DirectoryContext extends Context {

    /**
     * 파일 개수를 반환합니다.
     *
     * @returns {number} 파일 개수
     */
    get fileCount(): number;

    /**
     * 파일명 목록을 반환합니다.
     *
     * @returns {string[]} 파일명 목록
     */
    get fileNames(): string[];

    /**
     * 폴더명을 반환합니다.
     *
     * @returns {string} 폴더명
     */
    get name(): string;

    /**
     * 폴더 경로를 반환합니다.
     *
     * @returns {string} 폴더 경로
     */
    get path(): string;

    /**
     * 폴더 크기를 반환합니다.
     *
     * @returns {number} 폴더 크기
     */
    get size(): number;

}

/**
 * 파일 정보 인터페이스
 * 
 * @extends {Context}
 * @author Mux
 * @version 1.0.0
 */
interface FileContext extends Context {

    /**
     * 컨텐츠 타입을 반환합니다.
     *
     * @returns {string} 컨텐츠 타입
     */
    get contentType(): string;

    /**
     * 폴더 경로를 반환합니다.
     *
     * @returns {string} 폴더 경로
     */
    get directoryPath(): string;

    /**
     * 파일 확장자를 반환합니다.
     *
     * @returns {string} 파일 확장자
     */
    get extension(): string;

    /**
     * 파일 전체 경로를 반환합니다.
     *
     * @returns {string} 파일 전체 경로
     */
    get fullPath(): string;

    /**
     * 파일 권한을 반환합니다.
     *
     * @returns {BlobGrant} 파일 권한
     */
    get grant(): BlobGrant;

    /**
     * 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get name(): string;

    /**
     * 파일 크기를 반환합니다.
     *
     * @returns {number} 파일 크기
     */
    get size(): number;

}

/**
 * 경로 정보 인터페이스
 *
 * @extends {Context}
 * @author Mux
 * @version 1.0.0
 */
interface PathContext extends Context {

    /**
     * 경로를 반환합니다.
     *
     * @returns {string} 경로
     */
    get path(): string;

}


/**
 * 비어있는 정보 클래스
 *
 * @implements {Context}
 * @author Mux
 * @version 1.0.0
 */
class EmptyContext implements Context {

    /**
     * 정보 고유명
     *
     * @type {string}
     */
    static #contextName: string;

    static {
        this.#contextName = 'EmptyContext';
    }

    /**
     * 정보의 고유명을 반환합니다.
     *
     * @returns {string} 정보 고유명
     */
    get contextName(): string {
        return EmptyContext.#contextName;
    }

}

/**
 * 비어있는 경로 정보 클래스
 *
 * @implements {PathContext}
 * @author Mux
 * @version 1.0.0
 */
class EmptyPathContext implements PathContext {

    /**
     * 정보 고유명
     *
     * @type {string}
     */
    static #contextName: string;

    /**
     * 단일 객체
     *
     * @type {EmptyPathContext}
     */
    static #instance: EmptyPathContext;

    /**
     * {@link EmptyPathContext} 클래스의 생성자입니다.
     */
    constructor() {
        if (EmptyPathContext.#instance) {
            return EmptyPathContext.#instance;
        }

        EmptyPathContext.#instance = this;
    }

    static {
        this.#contextName = 'PathContext';
    }

    /**
     * 정보의 고유명을 반환합니다.
     *
     * @returns {string} 정보 고유명
     */
    get contextName(): string {
        return EmptyPathContext.#contextName;
    }

    /**
     * 빈 경로를 반환합니다.
     *
     * @returns {string} 경로
     */
    get path(): string {
        return '';
    }

}

/**
 * 폴더 정보 클래스
 *
 * @implements {DirectoryContext}
 * @author Mux
 * @version 1.0.0
 */
class SimpleDirectoryContext implements DirectoryContext {

    /**
     * 파일 개수
     *
     * @type {number}
     */
    #fileCount: number;

    /**
     * 파일명 목록
     *
     * @type {string[]}
     */
    #fileNames: string[];

    /**
     * 폴더 권한
     *
     * @type {BlobGrant}
     */
    #grant: BlobGrant;

    /**
     * 폴더명
     *
     * @type {string}
     */
    #name: string;

    /**
     * 폴더 경로
     *
     * @type {string}
     */
    #path: string;

    /**
     * 폴더 크기
     *
     * @type {number}
     */
    #size: number;

    /**
     * 정보 고유명
     *
     * @static
     * @type {string}
     */
    static #contextName: string;

    /**
     * {@link SimpleDirectoryContext} 클래스의 생성자입니다.
     *
     * @param {string[]} fileNames 하위 파일명 목록
     * @param {BlobGrant} grant 파일 권한
     * @param {string} name 폴더명
     * @param {string} path 폴더 경로
     * @param {number} size 폴더 크기
     */
    constructor(fileNames: string[], grant: BlobGrant, name: string, path: string, size: number) {
        this.#fileNames = fileNames;
        this.#fileCount = fileNames.length;
        this.#grant = grant;
        this.#name = name;
        this.#path = path;
        this.#size = size;
    }

    static {
        this.#contextName = 'DirectoryContext';
    }

    /**
     * 정보의 고유명을 반환합니다.
     *
     * @returns {string} 정보 고유명
     */
    get contextName(): string {
        return SimpleDirectoryContext.#contextName;
    }

    /**
     * 파일 개수를 반환합니다.
     *
     * @returns {number} 파일 개수
     */
    get fileCount(): number {
        return this.#fileCount;
    }

    /**
     * 파일명 목록을 반환합니다.
     *
     * @returns {string[]} 파일명 목록
     */
    get fileNames(): string[] {
        return global.structuredClone(this.#fileNames);
    }

    /**
     * 폴더명을 반환합니다.
     *
     * @returns {string} 폴더명
     */
    get name(): string {
        return this.#name;
    }

    /**
     * 폴더 경로를 반환합니다.
     *
     * @returns {string} 폴더 경로
     */
    get path(): string {
        return this.#path;
    }

    /**
     * 폴더 크기를 반환합니다.
     *
     * @returns {number} 폴더 크기
     */
    get size(): number {
        return this.#size;
    }

}

/**
 * 파일 정보 클래스
 *
 * @implements {FileContext}
 * @author Mux
 * @version 1.0.0
 */
class SimpleFileContext implements FileContext {

    /**
     * 컨텐츠 타입
     *
     * @type string
     */
    #contentType: string;

    /**
     * 폴더 경로
     *
     * @type {string}
     */
    #directoryPath: string;

    /**
     * 파일 확장자
     *
     * @type {string}
     */
    #extension: string;

    /**
     * 파일 권한
     *
     * @type {BlobGrant}
     */
    #grant: BlobGrant;

    /**
     * 파일명
     *
     * @type {string}
     */
    #name;

    /**
     * 파일 크기
     *
     * @type {number}
     */
    #size: number;

    /**
     * 정보 고유명
     *
     * @type {string}
     */
    static #contextName: string;

    /**
     * {@link SimpleFileContext} 클래스의 생성자입니다.
     *
     * @param {string} contentType 컨텐츠 타입
     * @param {string} directoryPath 폴더 경로
     * @param {string} extension 파일 확장자
     * @param {BlobGrant} grant 파일 권한
     * @param {string} name 파일명
     * @param {number} size 파일 크기
     */
    constructor(contentType: string, directoryPath: string, extension: string, grant: BlobGrant, name: string, size: number) {
        this.#contentType = contentType;
        this.#directoryPath = directoryPath;
        this.#extension = extension;
        this.#grant = grant;
        this.#name = name;
        this.#size = size;
    }

    static {
        this.#contextName = 'FileContext';
    }

    /**
     * 컨텐츠 타입을 반환합니다.
     *
     * @returns {string} 컨텐츠 타입
     */
    get contentType(): string {
        return this.#contentType;
    }

    /**
     * 정보의 고유명을 반환합니다.
     *
     * @returns {string} 정보 고유명
     */
    get contextName(): string {
        return SimpleFileContext.#contextName;
    }

    /**
     * 폴더 경로를 반환합니다.
     *
     * @returns {string} 폴더 경로
     */
    get directoryPath(): string {
        return this.#directoryPath;
    }

    /**
     * 파일 확장자를 반환합니다.
     *
     * @returns {string} 파일 확장자
     */
    get extension(): string {
        return this.#extension;
    }

    /**
     * 파일 전체 경로를 반환합니다.
     *
     * @returns {string} 파일 전체 경로
     */
    get fullPath(): string {
        return path.join(this.#directoryPath, this.#name);
    }

    /**
     * 파일 권한을 반환합니다.
     *
     * @returns {BlobGrant} 파일 권한
     */
    get grant(): BlobGrant {
        return this.#grant;
    }

    /**
     * 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get name(): string {
        return this.#name;
    }

    /**
     * 파일 크기를 반환합니다.
     *
     * @returns {number} 파일 크기
     */
    get size(): number {
        return this.#size;
    }

}

/**
 * 경로 정보 클래스
 *
 * @implements {PathContext}
 * @author Mux
 * @version 1.0.0
 */
class SimplePathContext implements PathContext {

    /**
     * 경로
     *
     * @type {string}
     */
    #path: string;

    /**
     * 정보 고유명
     *
     * @type {string}
     */
    static #contextName: string;

    /**
     * {@link SimplePathContext} 클래스의 생성자입니다.
     *
     * @param {string} path 경로
     */
    constructor(path: string) {
        this.#path = path;
    }

    static {
        this.#contextName = 'PathContext';
    }

    /**
     * 정보의 고유명을 반환합니다.
     *
     * @returns {string} 정보 고유명
     */
    get contextName(): string {
        return SimplePathContext.#contextName;
    }

    /**
     * 경로를 반환합니다.
     *
     * @returns {string} 경로
     */
    get path(): string {
        return this.#path;
    }

}

export type {
    Context,
    ContextFactory,
    DirectoryContext,
    FileContext,
    PathContext
};

export {
    SimpleDirectoryContext,
    EmptyContext,
    EmptyPathContext,
    SimpleFileContext,
    SimplePathContext
};