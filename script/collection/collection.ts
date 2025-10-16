import type { FileContext } from '@script/context/context';
import type { Tuple } from '@script/util/util';

/**
 * 파일 데이터 쌍 유형
 *
 * @author Mux
 * @version 1.0.0
 */
type FileDataPair = Pair<string, FileContext>;

/**
 * 개체 쌍 인터페이스
 *
 * @template T 첫 번째 개체 유형
 * @template V 두 번째 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface Pair<T, V> {

    /**
     * 첫 번째 개체를 반환합니다.
     *
     * @returns {T} 첫 번째 개체
     */
    get first(): T;

    /**
     * 두 번째 개체를 반환합니다.
     *
     * @returns {V} 두 번째 개체
     */
    get second(): V;

}

/**
 * 개체 쌍 유틸리티 클래스
 *
 * @template T 첫 번째 개체 유형
 * @template S 두 번째 개체 유형
 * @implements {Pair<T, S>}
 * @author Mux
 * @version 1.0.0
 */
class SimplePair<T, S> implements Pair<T, S> {

    /**
     * 첫 번째 개체
     *
     * @type {T}
     */
    #first: T;

    /**
     * 두 번째 개체
     *
     * @type {S}
     */
    #second: S;

    /**
     * {@link SimplePair} 클래스의 생성자입니다.
     *
     * @param {T} first 첫 번째 개체
     * @param {S} second 두 번째 개체
     */
    constructor(first: T, second: S) {
        this.#first = first;
        this.#second = second;
    }

    /**
     * 첫 번째 개체를 반환합니다.
     *
     * @returns {T} 첫 번째 개체
     */
    get first(): T {
        return this.#first;
    }

    /**
     * 두 번째 개체를 반환합니다.
     *
     * @returns {S} 두 번째 개체
     */
    get second(): S {
        return this.#second;
    }

}

/**
 * 튜플 개체 쌍 유틸리티 클래스
 * 
 * @template T 일반 개체 유형
 * @template {any[]} S 튜플 개체 유형
 * @implements {Pair<T, Tuple<S>>}
 */
class TuplePair<T, S extends any[]> implements Pair<T, Tuple<S>> {

    /**
     * 일반 개체
     *
     * @type {T}
     */
    #object: T;

    /**
     * 튜플 개체
     *
     * @type {S}
     */
    #tupleObject: S;

    /**
     * {@link TuplePair} 클래스의 생성자입니다.
     * 
     * @param {T} object 일반 개체
     * @param {Tuple<S>} tupleObject 튜플 개체
     */
    constructor(object: T, tupleObject: Tuple<S>) {
        this.#object = object;
        this.#tupleObject = tupleObject;
    }

    /**
     * 일반 개체를 반환합니다.
     *
     * @returns {T} 일반 개체
     */
    get first(): T {
        return this.#object;
    }

    /**
     * 튜플 개체를 반환합니다.
     *
     * @returns {S} 튜플 개체
     */
    get second(): S {
        return this.#tupleObject;
    }

}

export type {
    FileDataPair,
    Pair
};

export {
    SimplePair,
    TuplePair
};