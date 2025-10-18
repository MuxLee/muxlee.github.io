import fileSystem from 'fs';
import mimeType from 'mime-types';
import path from 'path';

import type { BlobGrant, FileObject } from '@script/blob/blob.js';
import { SimpleBlobGrant } from '@script/blob/blob.js';
import type { Context, DirectoryContext, FileContext, PathContext } from '@script/context/context.js';
import { SimpleDirectoryContext, SimpleFileContext } from '@script/context/context.js';
import { FileFactory, getAllPropertyDescriptor } from '@script/util/util.js';

/**
 * 비동기 로더 인터페이스
 *
 * @template T 개체 유형
 * @template R 반환 개체 유형
 * @extends {Loader<T, R>}
 * @author Mux
 * @version 1.0.0
 */
interface AsyncLoader<T, R> extends Loader<T, Promise<R>> {

    /**
     * 개체 로드 제한시간을 반환합니다.
     *
     * @returns {number} 로드 제한시간
     */
    get timeout(): number;

}

/**
 * 폴더 정보 로더 유형
 *
 * @author Mux
 * @version 1.0.0
 */
type DirectoryContextLoader = Loader<PathContext, DirectoryContext>

/**
 * 파일 정보 로더 유형
 *
 * @author Mux
 * @version 1.0.0
 */
type FileContextLoader = Loader<PathContext, FileContext>;

/**
 * 파일 로더 유형
 */
interface FileLoader<T, R extends FileObject | Promise<FileObject> = FileObject> extends Loader<T, R> {}

/**
 * 로더 인터페이스
 *
 * @template T 개체 유형
 * @template R 반환 개체 유형
 * @author Mux
 * @version 1.0.0
 */
declare interface Loader<T, R> {

    /**
     * 개체 로드를 수행하여 반환합니다.
     *
     * @param {T} object 개체
     * @returns {R} 개체
     */
    load(object: T): R;

    /**
     * 개체 로드가 가능한지 판별합니다.
     *
     * @param {T} object 개체
     * @returns {boolean} 개체 로드 가능여부
     */
    supports(object: T): boolean;

}

/**
 * 이진 데이터 로더 클래스
 * 
 * @protected
 * @template {Context} R 반환 정보 개체 유형
 * @implements {Loader<PathContext, R>}
 */
class _BlobContextLoader<R extends Context> implements Loader<PathContext, R> {

    /**
     * 이진 데이터 정보를 변환하여 반환합니다.
     * 
     * @param {PathContext} pathContext 경로 정보
     * @returns {R} 정보
     */
    load(pathContext: PathContext): R {
        throw new Error('\'load\' 메소드가 구현되지 않았습니다.');
    }

    /**
     * 정보 생성 가능여부를 판별합니다.
     * 
     * @param {PathContext} pathContext 
     * @returns {boolean} 생성 가능여부
     */
    supports(pathContext: PathContext): boolean {
        throw new Error('\'supports\' 메소드가 구현되지 않았습니다.');
    }

    /**
     * 파일 엑세스 가능여부를 반환합니다.
     *
     * @protected
     * @param {string} filePath 파일 경로
     * @param {number} mode 파일 권한
     * @returns {boolean} 엑세스 가능여부
     */
    _accessible(filePath: string, mode: number): boolean {
        try {
            fileSystem.accessSync(filePath, mode);

            return true;
        }
        catch {
            return false;
        }
    }

    /**
     * 특정 경로의 존재하는 대규모 이진 데이터 권한을 반환합니다.
     * 
     * @protected
     * @param {string} path 경로
     * @returns {BlobGrant} 대규모 이진 데이터 권한
     */
    _grant(path: string): BlobGrant {
        const executable = this._accessible(path, fileSystem.constants.X_OK);
        const readable = this._accessible(path, fileSystem.constants.R_OK);
        const writable = this._accessible(path, fileSystem.constants.W_OK);

        return SimpleBlobGrant.builder()
            .executable(executable)
            .readable(readable)
            .writable(writable)
            .build();
    }

}

/**
 * 파일 로더 추상화 클래스
 *
 * @protected
 * @template {FileObject | Promise<FileObject>} R 반환 파일 개체 유형
 * @implements {FileLoader<FileContext, R>}
 * @author Mux
 * @version 1.0.0
 */
class _FileLoader<R extends FileObject | Promise<FileObject>> implements FileLoader<FileContext, R> {

    /**
     * 파일을 불러와 파일 객체로 변환하여 반환합니다.
     *
     * @param {FileContext} fileContext 파일 정보
     * @returns {R} 파일 객체
     */
    load(fileContext: FileContext): R {
        throw new Error('\'load\' 메소드가 구현되지 않았습니다.');
    }

    /**
     * 파일 객체 생성 가능여부를 판별합니다.
     *
     * @param {FileContext} fileContext 파일 정보
     * @returns {boolean} 생성 가능여부
     */
    supports(fileContext: FileContext): boolean {
        const { grant } = fileContext;

        return grant.readable && grant.writable;
    }

}

/**
 * 비동기 파일 로더 클래스
 *
 * @extends {_FileLoader<Promise<FileObject>>}
 * @author Mux
 * @version 1.0.0
 */
class AsyncFileLoader extends _FileLoader<Promise<FileObject>> {

    /**
     * 파일 로드 제한시간
     *
     * @type {number}
     */
    #timeout: number;

    /**
     * {@link AsyncFileLoader} 클래스의 생성자입니다.
     *
     * @param {number} timeout 파일 로드 제한시간
     */
    constructor(timeout: number) {
        super();
        this.#timeout = timeout;
    }

    /**
     * 파일 로드 제한시간을 반환합니다.
     *
     * @returns {number} 로드 제한시간
     */
    get timeout(): number {
        return this.#timeout;
    }

    /**
     * 비동기로 파일을 불러와 파일 객체로 변환하여 반환합니다.
     *
     * <i>* 설정된 시간안에 변환이 실패할 경우 예외를 발생시킵니다.</i>
     *
     * @override
     * @param {FileContext} fileContext 파일 정보
     * @returns {Promise<FileObject>} 파일 객체
     */
    override load(fileContext: FileContext): Promise<FileObject> {
        return Promise.race([
            this.#load(fileContext),
            this.#loadTimeout()
        ]) as Promise<FileObject>;
    }

    /**
     * 파일 변환 가능여부를 판별합니다.
     *
     * @override
     * @param {FileContext} fileContext 파일 정보
     * @returns {boolean} 변환 가능여부
     */
    override supports(fileContext: FileContext): boolean {
        return this.#timeout > 0
            && !!fileContext.directoryPath
            && !!fileContext.name
            && fileContext.size > 0
            && super.supports(fileContext);
    }

    /**
     * 비동기로 파일을 불러와 파일 객체로 변환하여 반환합니다.
     *
     * @param {FileContext} fileContext 파일 정보
     * @returns {Promise<FileObject>} 파일 객체
     */
    #load(fileContext: FileContext): Promise<FileObject> {
        return new Promise(function(resolve, reject) {
            fileSystem.readFile(fileContext.fullPath, function(error, buffer) {
                if (error) {
                    reject(error);
                }

                const fileObject = FileFactory.fromBuffer(buffer, fileContext);

                resolve(fileObject);
            });
        });
    }

    /**
     * 파일 로드 제한시간을 설정합니다.
     *
     * @returns {Promise<never>} 제한시간
     */
    #loadTimeout(): Promise<never> {
        const timeout = this.#timeout;

        return new Promise(function(resolve, reject) {
            global.setTimeout(function() {
                const seconds = timeout / 1000;
                const timeoutError = new Error(`설정된 ${seconds}초 안에 불러오지 못하여 취소되었습니다.`);

                reject(timeoutError);
            }, timeout);
        });
    }

}

/**
 * 정보를 불러오지 않는 로더 클래스
 *
 * @implements {Loader<unknown, void>}
 */
class NotPerformContextLoader implements Loader<unknown, void> {

    /**
     * 정보를 생성하지 않고 예외를 발생시킵니다.
     *
     * @param {unknown} object 무시되는 파라미터
     * @throws Error 예외
     */
    load(object: unknown): never {
        throw new Error('이 클래스는 로더의 역할을 수행하지 않습니다.');
    }

    /**
     * 정보 생성 불가능함을 반환합니다.
     *
     * @param {unknown} object 무시되는 파라미터
     * @returns {boolean} 생성 불가능
     */
    supports(object: unknown): boolean {
        return false;
    }

}

/**
 * 파일 로더 클래스
 *
 * @extends {_FileLoader<FileObject>}
 */
class SyncFileLoader extends _FileLoader<FileObject> {

    /**
     * 파일을 불러와 파일 객체로 변환하여 반환합니다.
     *
     * @override
     * @param {FileContext} context 파일 정보
     * @returns {FileObject} 파일 객체
     */
    override load(context: FileContext): FileObject {
        const { fullPath } = context;

        try {
            const text = fileSystem.readFileSync(fullPath, 'utf8');

            return FileFactory.fromBuffer(text, context);
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * 파일 변환 가능여부를 판별합니다.
     *
     * @override
     * @param {FileContext} context 파일 정보
     * @returns {boolean} 변환 가능여부
     */
    override supports(context: FileContext): boolean {
        return !!context.directoryPath
            && !!context.name
            && context.size > 0
            && super.supports(context);
    }

}

/**
 * 폴더 정보 로더 클래스
 *
 * @extends {_BlobContextLoader<DirectoryContext>}
 * @author Mux
 * @version 1.0.0
 */
class SimpleDirectoryContextLoader extends _BlobContextLoader<DirectoryContext> {

    /**
     * 폴더 정보를 생성하여 반환합니다.
     *
     * @override
     * @param {PathContext} pathContext 경로 정보
     * @returns {DirectoryContext} 폴더 정보
     */
    override load(pathContext: PathContext): DirectoryContext {
        const { path: directoryPath } = pathContext;
        const fileNames = fileSystem.readdirSync(directoryPath);
        const grant = super._grant(directoryPath);
        const name = path.basename(directoryPath);
        const status = fileSystem.statSync(directoryPath);
        const size = status.size;

        return new SimpleDirectoryContext(fileNames, grant, name, directoryPath, size)
    }

    /**
     * 폴더 정보 생성 가능여부를 판별합니다.
     *
     * @override
     * @param {PathContext} pathContext 경로 정보
     * @returns {boolean} 생성 가능여부
     */
    override supports(pathContext: PathContext): boolean {
        const exists = fileSystem.existsSync(pathContext.path);

        if (exists) {
            const status = fileSystem.statSync(pathContext.path);

            return status.isDirectory();
        }

        return false;
    }

}

/**
 * 파일 정보 로더 클래스
 *
 * @extends {_BlobContextLoader<FileContext>}
 * @author Mux
 * @version 1.0.0
 */
class SimpleFileContextLoader extends _BlobContextLoader<FileContext> {

    /**
     * 파일 정보를 생성하여 반환합니다.
     *
     * @override
     * @param {PathContext} pathContext 경로 정보
     * @returns {FileContext} 파일 정보
     */
    override load(pathContext: PathContext): FileContext {
        const { path: filePath } = pathContext;
        const contentType = mimeType.lookup(filePath) || 'unknown';
        const directoryPath = path.dirname(filePath);
        const extension = path.extname(filePath);
        const grant = super._grant(filePath);
        const name = path.basename(filePath);
        const size = grant.readable ? fileSystem.statSync(filePath).size : -1;

        return new SimpleFileContext(contentType, directoryPath, extension, grant, name, size);
    }

    /**
     * 파일 정보 생성 가능여부를 판별합니다.
     *
     * @override
     * @param {PathContext} pathContext 경로 정보
     * @returns {boolean} 생성 가능여부
     */
    override supports(pathContext: PathContext): boolean {
        const descriptor = getAllPropertyDescriptor(pathContext, 'path');

        if (descriptor?.get) {
            const path = pathContext.path;

            if (typeof path === 'string' && path.length > 0) {
                return super._accessible(path, fileSystem.constants.F_OK);
            }
        }

        return false;
    }
    
}

export type {
    AsyncLoader,
    DirectoryContextLoader,
    FileContextLoader,
    FileLoader,
    Loader
};

export {
    AsyncFileLoader,
    NotPerformContextLoader,
    SimpleDirectoryContextLoader,
    SimpleFileContextLoader,
    SyncFileLoader
};