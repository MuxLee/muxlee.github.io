import type { MetadataContext } from '@metadata/context/context.js';
import type { MetadataCreator } from '@metadata/creator/creator.js';

/**
 * 메타데이터 생성기 체인 인터페이스
 *
 * @template R 반환 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface MetadataCreatorChain<R = void> {

    /**
     * 메타데이터 생성기 체인을 시작합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {R} 개체
     */
    chain<T>(object: T, metadataContext: MetadataContext): R;

}

/**
 * 비동기 메타데이터 생성기 체인 클래스
 *
 * @implements {MetadataCreatorChain<Promise<void>>}
 * @author Mux
 * @version 1.0.0
 */
class AsyncMetadataCreatorChain implements MetadataCreatorChain<Promise<void>> {

    /**
     * 메타데이터 생성기 체인 인덱스
     *
     * @type {number}
     */
    #metadataCreatorIndex: number;

    /**
     * 메타데이터 생성기 목록
     *
     * @type {MetadataCreator<unknown>[]}
     */
    #metadataCreators: MetadataCreator<unknown>[];

    /**
     * {@link AsyncMetadataCreatorChain} 클래스의 생성자입니다.
     *
     * @param {MetadataCreator<unknown>[]} metadataCreators 메타데이터 생성기 목록
     */
    constructor(metadataCreators: MetadataCreator<unknown>[]) {
        this.#metadataCreatorIndex = 0;
        this.#metadataCreators = metadataCreators;
    }

    /**
     * 메타데이터 생성기 체인을 시작합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {Promise<void>}
     */
    async chain<T>(object: T, metadataContext: MetadataContext): Promise<void> {
        if (this.#metadataCreatorIndex >= this.#metadataCreators.length) {
            return;
        }

        const metadataCreator = this.#metadataCreators[this.#metadataCreatorIndex];;

        this.#metadataCreatorIndex = this.#metadataCreatorIndex + 1;
        await metadataCreator.create(object, metadataContext, this);
    }

}

/**
 * 동기 메타데이터 생성기 체인 클래스
 *
 * @implements {MetadataCreatorChain}
 * @author Mux
 * @version 1.0.0
 */
class SyncMetadataCreatorChain implements MetadataCreatorChain {

    /**
     * 메타데이터 생성기 체인 인덱스
     *
     * @type {number}
     */
    #metadataCreatorIndex: number;

    /**
     * 메타데이터 생성기 목록
     *
     * @type {MetadataCreator<unknown>[]}
     */
    #metadataCreators: MetadataCreator<unknown>[];

    /**
     * {@link MetadataCreatorChain} 클래스의 생성자입니다.
     *
     * @param {MetadataCreator<unknown>[]} metadataCreators 메타데이터 생성기 목록
     */
    constructor(metadataCreators: MetadataCreator<unknown>[]) {
        this.#metadataCreatorIndex = 0;
        this.#metadataCreators = metadataCreators;
    }

    /**
     * 메타데이터 생성 체인을 시작합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @returns {void}
     */
    chain<T>(object: T, metadataContext: MetadataContext): void {
        if (this.#metadataCreatorIndex >= this.#metadataCreators.length) {
            return;
        }

        const metadataCreator = this.#metadataCreators[this.#metadataCreatorIndex];;

        this.#metadataCreatorIndex = this.#metadataCreatorIndex + 1;
        metadataCreator.create(object, metadataContext, this);
    }

}

export type {
    MetadataCreatorChain
};

export {
    AsyncMetadataCreatorChain,
    SyncMetadataCreatorChain
};