import type { CreatorChain } from '@script/creator/chain';

/**
 * 생성기 인터페이스
 *
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface Creator<T> {

    /**
     * 개체를 생성합니다.
     *
     * @param {T} object 개체
     * @param {CreatorChain} creatorChain 생성기 체인
     * @returns {void}
     */
    create(object: T, creatorChain: CreatorChain): void;

}

export type {
    Creator
};