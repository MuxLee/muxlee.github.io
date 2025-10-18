import jsYaml from 'js-yaml';

import type { StringSerializeStrategy } from '@script/serialize/strategy';

/**
 * 역직렬화 인터페이스
 *
 * @template T 개체 유형
 * @template R 반환 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface Deserializer<T, R> {

    /**
     * 개체릁 역직렬화하여 반환합니다.
     *
     * @param {T} object 개체
     * @returns {R} 역직렬화된 개체
     */
    deserialize(object: T): R;

    /**
     * 개체를 역직렬화 가능한지 판별합니다.
     *
     * @template S 개체 유형
     * @param {S} object 개체
     * @returns {boolean} 역직렬화 가능여부
     */
    supports<S>(object: S): boolean;

}

/**
 * 직렬화 인터페이스
 *
 * @template T 개체 유형
 * @template R 반환 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface Serializer<T, R> {

    /**
     * 개체를 직렬화하여 반환합니다.
     *
     * @param {T} object 개체
     * @returns {R} 직렬화된 개체
     */
    serialize(object: T): R;

    /**
     * 개체를 직렬화 가능한지 판별합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 직렬화 가능여부
     */
    supports<T>(object: T): boolean;

}

/**
 * 메타 정보 역직렬화 클래스
 *
 * @implements {Deserializer<string, object>}
 * @author Mux
 * @version 1.0.0
 */
class MetaDeserializer implements Deserializer<string, object> {

    /**
     * 메타 정보 정규 표현식
     *
     * @type {RegExp}
     */
    static #metaRegExp: RegExp;

    static {
        this.#metaRegExp = /^(?<=-{3}\n)(.|\s)*?(?=\n---)/m;
    }

    /**
     * 메타 정보를 오브젝트로 역직렬화하여 반환합니다.
     *
     * @param {string} object 메타 정보
     * @returns {object} 메타 오브젝트
     */
    deserialize(object: string): object {
        const matchGroup = object.match(MetaDeserializer.#metaRegExp);

        if (matchGroup && matchGroup.length > 0) {
            return jsYaml.load(matchGroup[0]) as object;
        }

        throw new Error('메타 정보를 역직렬화할 수 없습니다.');
    }

    /**
     * 메타 정보를 역직렬화 가능한지 판별합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 역직렬화 가능여부
     */
    supports<T>(object: T): boolean {
        return !!object && typeof object === 'string' && MetaDeserializer.#metaRegExp.test(object);
    }

}

/**
 * 오브젝트 역직렬화 클래스
 *
 * @implements {Deserializer<boolean | number | string, object>}
 * @author Mux
 * @version 1.0.0
 */
class ObjectDeserializer implements Deserializer<boolean | number | string, object> {

    /**
     * 개체를 오브젝트로 역직렬화하여 반환합니다.
     *
     * @param {boolean | number | string} object 개체
     * @returns {object} 오브젝트
     */
    deserialize(object: boolean | number | string): object {
        return JSON.parse(object as any);
    }

    /**
     * 개체를 역직렬화 가능한지 판별합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 역직렬화 가능여부
     */
    supports<T>(object: T): boolean {
        if (object) {
            if (typeof object === 'boolean' || typeof object === 'number') {
                return true;
            }
            else if (typeof object === 'string' && object.length > 0) {
                const trimmed = object.trim();

                return trimmed.startsWith('{') && trimmed.endsWith('}');
            }
        }

        return false;
    }

}

/**
 * 문자열 직렬화 클래스
 *
 * @implements {Serializer<object | string, string>}
 * @author Mux
 * @version 1.0.0
 */
class StringSerializer implements Serializer<object | string, string> {

    /**
     * 문자열 직렬화 전략 목록
     *
     * @type {StringSerializeStrategy<unknown>[]}
     */
    #strategies: StringSerializeStrategy<unknown>[];

    /**
     * {@link StringSerializer} 클래스의 생성자입니다.
     */
    constructor() {
        this.#strategies = [];
    }

    /**
     * 문자열 직렬화 전략을 등록합니다.
     *
     * @template T 직렬화 유형
     * @param {StringSerializeStrategy<T>} strategy 문자열 직렬화 전략
     * @returns {void}
     */
    registerStrategy<T>(strategy: StringSerializeStrategy<T>): void {
        this.#strategies.push(strategy);
    }

    /**
     * 개체를 문자열로 직렬화하여 반환합니다.
     *
     * @param {object | string} object 개체
     * @returns {string} 문자열
     */
    serialize(object: object | string): string {
        for (const strategy of this.#strategies) {
            if (strategy.supports(object)) {
                object = strategy.proceed(object);
            }
        }

        if (typeof object === 'string') {
            return object;
        }

        return object.toString();
    }

    /**
     * 개체를 문자열로 직렬화 가능한지 판별합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 직렬화 가능여부
     */
    supports<T>(object: T): boolean {
        if (typeof object === 'string') {
            return object.length > 0;
        }

        return !!object;
    }

}

export type {
    Deserializer,
    Serializer
};

export {
    MetaDeserializer,
    ObjectDeserializer,
    StringSerializer
};