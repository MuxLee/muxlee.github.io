/**
 * 문자열 직렬화 전략 인터페이스
 *
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface StringSerializeStrategy<T> {

    /**
     * 직렬화 전략을 수행합니다.
     *
     * @param {T} object 개체
     * @returns {string} 문자열
     */
    proceed(object: T): string;

    /**
     * 직렬화 전략 수행이 가능한지 판별합니다.
     *
     * @template S 개체 유형
     * @param {S} object 개체
     * @returns {boolean} 수행 가능여부
     */
    supports<S>(object: S): boolean;

}

/**
 * 접두사 직렬화 전략 클래스
 *
 * @implements {StringSerializeStrategy<object | string>}
 * @author Mux
 * @version 1.0.0
 */
class PrefixSerializeStrategy implements StringSerializeStrategy<object | string> {

    /**
     * 접두사
     *
     * @type {string}
     */
    #prefix: string;

    /**
     * {@link PrefixSerializeStrategy} 클래스의 생성자입니다.
     *
     * @param {string} prefix 접두사
     */
    constructor(prefix: string) {
        this.#prefix = prefix;
    }

    /**
     * 개체에 접두사 직렬화 전략을 수행합니다.
     *
     * @param {object | string} object 개체
     * @returns {string} 문자열
     */
    proceed(object: object | string): string {
        if (typeof object === 'string') {
            return this.#prefix + object;
        }

        return this.#prefix + object.toString();
    }

    /**
     * 접두사 직렬화 전략 수행이 가능한지 판별합니다.
     *
     * @template S 개체 유형
     * @param {S} object 개체
     * @returns {boolean} 수행 가능여부
     */
    supports<S>(object: S): boolean {
        return !!object && (typeof object === 'string' || (typeof object === 'object' && 'toString' in object));
    }

}

/**
 * 진법 직렬화 전략 클래스
 *
 * @implements {StringSerializeStrategy<bigint | number>}
 * @author Mux
 * @version 1.0.0
 */
class RadixSerializeStrategy implements StringSerializeStrategy<bigint | number> {

    /**
     * 진법
     *
     * @type {number}
     */
    #radix: number;

    /**
     * {@link RadixSerializeStrategy} 클래스의 생성자입니다.
     *
     * <i>* 진법 파라미터 값은 2(진법)와 16(진법) 사이의 값을 입력해야합니다.</i>
     * @param {number} radix 진법
     */
    constructor(radix: number) {
        this.#radix = radix;
    }

    /**
     * 숫자형 개체에 진법 직렬화 전략을 수행합니다.
     *
     * @param {bigint | number} object 개체
     * @returns {string} 문자열
     */
    proceed(object: bigint | number): string {
        return object.toString(this.#radix);
    }

    /**
     * 진법 직렬화 전략 수행이 가능한지 판별합니다.
     *
     * @template S 개체 유형
     * @param {S} object 개체
     * @returns {boolean} 수행 가능여부
     */
    supports<S>(object: S): boolean {
        return typeof object ==='bigint' || typeof object === 'number';
    }

}

/**
 * 접미사 직렬화 전략 클래스
 *
 * @implements {StringSerializeStrategy<object | string>}
 * @author Mux
 * @version 1.0.0
 */
class SuffixSerializeStrategy implements StringSerializeStrategy<object | string> {

    /**
     * 접미사
     *
     * @type {string}
     */
    #suffix: string;

    /**
     * {@link SuffixSerializeStrategy} 클래스의 생성자입니다.
     *
     * @param {string} suffix 접미사
     */
    constructor(suffix: string) {
        this.#suffix = suffix;
    }

    /**
     * 개체에 접미사 직렬화 전략을 수행합니다.
     *
     * @param {object | string} object 개체
     * @returns {string} 문자열
     */
    proceed(object: object | string): string {
        return this.#suffix + object.toString();
    }

    /**
     * 접미사 직렬화 전략 수행이 가능한지 판별합니다.
     *
     * @template S 개체 유형
     * @param {S} object 개체
     * @returns {boolean} 수행 가능여부
     */
    supports<S>(object: S): boolean {
        return !!object && (typeof object === 'string' || (typeof object === 'object' && 'toString' in object));
    }

}

export type {
    StringSerializeStrategy
};

export {
    PrefixSerializeStrategy,
    RadixSerializeStrategy,
    SuffixSerializeStrategy
};