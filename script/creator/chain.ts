import { type Creator } from '@script/creator/creator';

/**
 * 생성기 체인 인터페이스
 *
 * @author Mux
 * @version 1.0.0
 */
interface CreatorChain {

    /**
     * 개체 생성기 체인을 시작합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {void}
     */
    chain<T>(object: T): void;

}


/**
 * 생성기 체인 클래스
 *
 * @implements {CreatorChain}
 * @author Mux
 * @version 1.0.0
 */
class SimpleCreatorChain implements CreatorChain {

    /**
     * 생성기 체인 인덱스
     *
     * @type {number}
     */
    #creatorIndex: number;

    /**
     * 생성기 목록
     *
     * @type {Creator<unknown>[]}
     */
    #creators: Creator<unknown>[];

    /**
     * {@link SimpleCreatorChain} 클래스의 생성자입니다.
     *
     * @param {...Creator<unknown>} creators 생성기 목록
     */
    constructor(...creators: Creator<unknown>[]) {
        this.#creatorIndex = 0;
        this.#creators = creators;
    }

    /**
     * 개체 생성기 체인을 시작합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {void}
     */
    chain<T>(object: T): void {
        if (this.#creatorIndex >= this.#creators.length) {
            return;
        }

        const creator = this.#creators[this.#creatorIndex];

        this.#creatorIndex = this.#creatorIndex + 1;
        creator.create(object, this);
    }

}

export type {
    CreatorChain
};

export {
    SimpleCreatorChain
};