import type { Builder } from '@script/builder/builder';

/**
 * 대규모 이진 데이터 권한 인터페이스
 *
 * @author Mux
 * @version 1.0.0
 */
interface BlobGrant {

    /**
     * 실행/탐색 가능여부를 반환합니다.
     *
     * @returns {boolean} 실행/탐색 가능여부
     */
    get executable(): boolean;

    /**
     * 읽기 가능여부를 반환합니다.
     *
     * @returns {boolean} 내용 읽기 가능여부
     */
    get readable(): boolean;

    /**
     * 수정 가능여부를 반환합니다.
     *
     * @returns {boolean} 수정 가능여부
     */
    get writable(): boolean;

}

/**
 * 대규모 이진 데이터 권한 빌더 인터페이스
 * 
 * @extends {Builder<BlobGrant>}
 * @author Mux
 * @version 1.0.0
 */
interface BlobGrantBuilder extends Builder<BlobGrant> {

    /**
     * 실행/탐색 가능여부를 설정합니다.
     *
     * @param {boolean} executable 실행/탐색 가능여부
     * @returns {BlobGrantBuilder} 빌더 객체
     */
    executable(executable: boolean): BlobGrantBuilder;

    /**
     * 읽기 가능여부를 설정합니다.
     *
     * @param {boolean} readable 읽기 가능여부
     * @returns {BlobGrantBuilder} 빌더 객체
     */
    readable(readable: boolean): BlobGrantBuilder;

    /**
     * 수정 가능여부를 설정합니다.
     *
     * @param {boolean} writable 수정 가능여부
     * @returns {BlobGrantBuilder} 빌더 객체
     */
    writable(writable: boolean): BlobGrantBuilder;

}

/**
 * 파일 객체 인터페이스
 *
 * @implements {Blob}
 * @implements {BlobGrant}
 * @author Mux
 * @version 1.0.0
 */
interface FileObject extends Blob, BlobGrant {

    /**
     * 컨텐츠 타입을 반환합니다.
     *
     * @returns {string} 컨텐츠 타입
     */
    get contentType(): string;

    /**
     * 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get name(): string;

}

/**
 * 대규모 이진 데이터 권한 클래스
 *
 * @implements {BlobGrant}
 * @author Mux
 * @version 1.0.0
 */
class SimpleBlobGrant implements BlobGrant {

    /**
     * 실행/탐색 가능여부
     *
     * @type {boolean}
     */
    #executable: boolean;

    /**
     * 읽기 가능여부
     *
     * @type {boolean}
     */
    #readable: boolean;

    /**
     * 쓰기 가능여부
     *
     * @type {boolean}
     */
    #writable: boolean;

    /**
     * 대규모 이진 데이터 권한 빌더 클래스
     *
     * @static
     * @type {new() => BlobGrantBuilder}
     */
    static #Builder: new () => BlobGrantBuilder;

    /**
     * {@link SimpleBlobGrant} 클래스의 생성자입니다.
     *
     * @param {boolean} executable 실행/탐색 가능여부
     * @param {boolean} readable 읽기 가능여부
     * @param {boolean} writable 수정 가능여부
     */
    constructor(executable: boolean, readable: boolean, writable: boolean) {
        this.#executable = executable;
        this.#readable = readable;
        this.#writable = writable;
    }

    static {
        SimpleBlobGrant.#Builder = class {

            /**
             * 실행/탐색 가능여부
             *
             * @type {boolean}
             */
            #executable: boolean;

            /**
             * 읽기 가능여부
             *
             * @type {boolean}
             */
            #readable: boolean;

            /**
             * 쓰기 가능여부
             *
             * @type {boolean}
             */
            #writable: boolean;

            /**
             * {@link SimpleBlobGrant.#Builder} 클래스의 생성자입니다.
             */
            constructor() {
                this.#executable = false;
                this.#readable = false;
                this.#writable = false;
            }

            /**
             * {@link SimpleBlobGrant} 객체를 생성하여 반환합니다.
             *
             * @returns {SimpleBlobGrant} 대규모 이진 데이터 권한
             */
            build(): SimpleBlobGrant {
                return new SimpleBlobGrant(this.#executable, this.#readable, this.#writable);
            }

            /**
             * 실행/탐색 가능여부를 설정합니다.
             *
             * @param {boolean} executable 실행/탐색 가능여부
             * @returns {BlobGrantBuilder} 빌더 객체
             */
            executable(executable: boolean): BlobGrantBuilder {
                this.#executable = executable;

                return this;
            }

            /**
             * 읽기 가능여부를 설정합니다.
             *
             * @param {boolean} readable 읽기 가능여부
             * @returns {BlobGrantBuilder} 빌더 객체
             */
            readable(readable: boolean): BlobGrantBuilder {
                this.#readable = readable;

                return this;
            }

            /**
             * 수정 가능여부를 설정합니다.
             *
             * @param {boolean} writable 수정 가능여부
             * @returns {BlobGrantBuilder} 빌더 객체
             */
            writable(writable: boolean): BlobGrantBuilder {
                this.#writable = writable;

                return this;
            }

        }
    }

    /**
     * 실행/탐색 가능여부를 반환합니다.
     *
     * @returns {boolean} 실행/탐색 가능여부
     */
    get executable(): boolean {
        return this.#executable;
    }

    /**
     * 읽기 가능여부를 반환합니다.
     *
     * @returns {boolean} 내용 읽기 가능여부
     */
    get readable(): boolean {
        return this.#readable;
    }

    /**
     * 수정 가능여부를 반환합니다.
     *
     * @returns {boolean} 수정 가능여부
     */
    get writable(): boolean {
        return this.#writable;
    }

    /**
     * 대규모 이진 데이터 권한을 설정합니다.
     *
     * @returns {BlobGrantBuilder} 대규모 이진 데이터 권한 빌더
     */
    static builder(): BlobGrantBuilder {
        return new SimpleBlobGrant.#Builder();
    }

}

/**
 * 파일 객체 클래스
 * 
 * @implements {FileObject}
 * @author Mux
 * @version 1.0.0
 */
class SimpleFileObject extends Blob implements FileObject {

    /**
     * 컨텐츠 타입
     *
     * @type {string}
     */
    #contentType: string;

    /**
     * 파일명
     *
     * @type {string}
     */
    #fileName: string;

    /**
     * 실행/탐색 가능여부
     *
     * @type {boolean}
     */
    #executable: boolean;

    /**
     * 읽기 가능여부
     *
     * @type {boolean}
     */
    #readable: boolean;

    /**
     * 쓰기 가능여부
     *
     * @type {boolean}
     */
    #writable: boolean;

    /**
     * {@link NamedBlob} 클래스의 생성자입니다.
     *
     * @param {BlobPart[] | undefined} sources 파일 데이터
     * @param {string} contentType 컨텐츠 타입
     * @param {string} fileName 파일명
     * @param {BlobGrant} grant 권한
     */
    constructor(sources: BlobPart[] | undefined, contentType: string, fileName: string, grant: BlobGrant) {
        super(sources, {
            endings: 'transparent',
            type: fileName
        });
        this.#contentType = contentType;
        this.#fileName = fileName;
        this.#executable = grant.executable;
        this.#readable = grant.readable;
        this.#writable = grant.writable;
    }

    /**
     * 컨텐트 타입을 반환합니다.
     *
     * @returns {string} 컨텐트 타입
     */
    get contentType(): string {
        return this.#contentType;
    }

    /**
     * 실행/탐색 가능여부를 반환합니다.
     *
     * @returns {boolean} 실행/탐색 가능여부
     */
    get executable(): boolean {
        return this.#executable;
    }

    /**
     * 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get name(): string {
        return this.#fileName;
    }

    /**
     * 읽기 가능여부를 반환합니다.
     *
     * @returns {boolean} 읽기 가능여부
     */
    get readable(): boolean {
        return this.#readable;
    }

    /**
     * 수정 가능여부를 반환합니다.
     *
     * @returns {boolean} 수정 가능여부
     */
    get writable(): boolean {
        return this.#writable;
    }

}

export type {
    BlobGrant,
    BlobGrantBuilder,
    FileObject
};

export {
    SimpleBlobGrant,
    SimpleFileObject
};
