import type { FileObject } from '@script/blob/blob';
import { SimpleFileObject } from '@script/blob/blob';

/**
 * 모든 형태의 배열 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type AnyArray = any[];

/**
 * 클래스 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type Class = new (...args: any[]) => any;

/**
 * 클래스 객체 유형
 * 
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type ClassInstance<T> = T extends Class ? never : T;

/**
 * 클래스 객체 튜플 유형
 * 
 * @template {Class[]} T 클래스 개체 배열 유형
 * @author Mux
 * @version 1.0.0
 */
type ClassInstanceTuple<T extends Class[]> = {

    [K in keyof T]: InstanceType<T[K]>;
    
};

/**
 * 클래스 튜플 유형
 * 
 * @template {Class[]} T 클래스 개체 배열 유형
 * @author Mux
 * @version 1.0.0
 */
type ClassTuple<T extends Class[]> = [...T];

/**
 * 클래스 생성자 유형
 *
 * @template {unknown} T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type Constructor<T = unknown> = new (...args: any[]) => T;

/**
 * 클래스 객체 튜플 유형
 * 
 * @template {Constructor<T>} T 클래스 생성자 개체 배열 유형
 * @author Mux
 * @version 1.0.0
 */
type ConsturctorInstanceTuple<T extends Constructor<T>[]> = {

    [K in keyof T]: InstanceType<T[K]>;

}

/**
 * 클래스 생성자 튜플 유형
 * 
 * @template {Constructor<T>[]} T 클래스 생성자 개체 배열 유형
 * @author Mux
 * @version 1.0.0
 */
type ConsturctorTuple<T extends Constructor<T>[]> = [...T];

/**
 * 속성 선언 유형
 * 
 * @template {object} T 개체 유형
 * @template {PropertyKey} K 속성키
 * @template V 속성값
 * @author Mux
 * @version 1.0.0
 */
type DefineObject<T extends object, K extends PropertyKey, V> = T & {

    [P in K]: V;

};

/**
 * 속성 선언 전략 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface DefineStrategy {

    /**
     * 전략을 적용하여 속성 선언을 수행합니다.
     * 
     * @returns {PropertyDescriptor} 개체 속성
     */
    defineStrategy(): PropertyDescriptor;

}

/**
 * 비-배열 유형
 * 
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type NonArray<T> = T extends Array<unknown> ? never : T;

/**
 * <code>null</code>이 포함된 유형
 * 
 * @template T 개체 유형
 */
type Nullable<T> = T | null;

/**
 * 튜플 유형
 * 
 * @template {any[]} T
 * @author Mux
 * @version 1.0.0
 */
type Tuple<T extends any[]> = [...T];

/**
 * 단일 클래스 객체 유형
 * 
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type SingleClassInstance<T> = ClassInstance<T> & NonArray<T>;

/**
 * 원시 유형
 * 
 * @author Mux
 * @version 1.0.0
 */
type PrimitiveType = 'bigint' | 'boolean' | 'function' | 'number' | 'object' | 'string' | 'symbol' | 'undefined';

/**
 * 개체 공급 유형
 * 
 * @template R 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type Supplier<R> = () => R;

/**
 * <code>undefined</code>가 포함된 유형
 * 
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type Undefinable<T> = T | undefined;

/**
 * 파일 생성 유틸리티 클래스
 * 
 * @author Mux
 * @version 1.0.0
 */
class FileFactory {

    /**
     * 버퍼로부터 파일 개체를 생성하여 반환합니다.
     *
     * @param {NonSharedBuffer | string} buffer 버퍼
     * @param {FileContext} fileContext 파일 정보
     * @returns {FileObject} 파일 개체
     */
    static fromBuffer(buffer: NonSharedBuffer | string, fileContext: FileContext): FileObject {
        const bufferArray = Buffer.from(buffer);

        return new SimpleFileObject(
            [bufferArray],
            fileContext.contentType,
            fileContext.name,
            fileContext.grant
        );
    }

}

/**
 * 열거형 속성 선언 전략 클래스
 * 
 * @implements {DefineStrategy}
 * @author Mux
 * @version 1.0.0
 */
class EnumerableDefineStrategy implements DefineStrategy {

    /**
     * 열거형 선언 전략 조건
     *
     * @type {Pick<PropertyDescriptor, 'enumerable'>}
     */
    #enumerableDescriptor: Pick<PropertyDescriptor, 'enumerable'>;

    /**
     * {@link EnumerableDefineStrategy} 클래스의 생성자입니다.
     */
    constructor() {        
        this.#enumerableDescriptor = {
            enumerable: true
        };
    }

    /**
     * 열거형 전략 조건을 반환합니다.
     *
     * @returns {Pick<PropertyDescriptor, 'enumerable'>} 열거형 전략 조건
     */
    defineStrategy(): Pick<PropertyDescriptor, 'enumerable'> {
        return global.structuredClone(this.#enumerableDescriptor);
    }

}

/**
 * 속성 정의 유틀리티 클래스
 * 
 * @author Mux
 * @version 1.0.0
 */
class ObjectDefiners {
    
    /**
     * 열거형 정의 전략
     */
    static #enumerableStrategy;

    static {
        this.#enumerableStrategy = new EnumerableDefineStrategy();
    }

     /**
     * 전달된 속성을 정의하여 반환합니다.
     *
     * @template {object} T 오브젝트 제네릭 타입
     * @template {PropertyKey} K 속성명 제네릭 타입
     * @template V 속성값 제네릭 타입
     * @param {T} target 대상 오브젝트
     * @param {K} key 속성키
     * @param {V} value 속성값
     * @param {DefineStrategy} defineStrategy 정의 전략 조건
     * @returns {DefineObject<T, K, V>} 오브젝트
     */
    static objectDefiner<T extends object, K extends PropertyKey, V>(
        target: T, key: K, value: V, defineStrategy: DefineStrategy
    ): DefineObject<T, K, V> {
        const attributes = defineStrategy.defineStrategy();

        global.Object.defineProperty(target, key, {
            value,
            ...attributes
        });

        return target as DefineObject<T, K, V>;
    }

    /**
     * 전달된 속성을 열거 가능하도록 정의하여 반환합니다.
     *
     * @template {object} T 오브젝트 제네릭 타입
     * @template {PropertyKey} K 속성키 제네릭 타입
     * @template V 속성값 제네릭 타입
     * @param {T} target 대상 오브젝트
     * @param {K} key 속성키
     * @param {V} value 속성값
     * @returns {DefineObject<T, K, V>} 오브젝트
     */
    static onlyEnumerable<T extends object, K extends PropertyKey, V>(target: T, key: K, value: V): DefineObject<T, K, V> {
        return ObjectDefiners.objectDefiner(target, key, value, ObjectDefiners.#enumerableStrategy);
    }

    /**
     * 전달된 속성들을 열거 가능하도록 정의하여 반환합니다.
     *
     * @template {object} T 오브젝트 제네릭 타입
     * @template {Record<PropertyKey, any>} P 속성 제네릭 타입
     * @param {T} target
     * @param {P} properties
     * @returns {T & P} 오브젝트
     */
    static onlyWereEnumerable<T extends object, P extends Record<PropertyKey, any>>(target: T, properties: P): T & P {
        for (const propertyName in properties) {
            const property = properties[propertyName];

            ObjectDefiners.onlyEnumerable(target, propertyName, property);
        }

        return target as T & P;
    }

}

/**
 * 클래스 형태 정규 표현식
 * 
 * @protected
 * @type {RegExp}
 */
const _classRegExp: RegExp = new RegExp(/^class\s/);

/**
 * 개체의 속성 정의를 반환합니다.
 * 
 * @template T 개체 제네릭 유형
 * @param {T} target 개체
 * @param {PropertyKey} propertyKey 개체 속성명
 * @returns {Nullable<PropertyDescriptor>} 속성 정보
 */
function getAllPropertyDescriptor<T>(target: T, propertyKey: PropertyKey): Nullable<PropertyDescriptor> {
    let object = target;

    while (object) {
        const descriptor = global.Object.getOwnPropertyDescriptor(object, propertyKey);
        
        if (descriptor) {
            return descriptor;
        }

        object = global.Object.getPrototypeOf(object);
    }
    
    return null;
}

/**
 * 개체가 클래스 유형인지 판별합니다.
 * 
 * @param {any} object 개체
 * @returns {object is Class} 클래스 유형 여부
 */
function isClass(object: any): object is Class {
    if (typeof object === 'function') {
        const string = object.toString();

        return _classRegExp.test(string);
    }

    return false;
}

/**
 * 중첩 오브젝트의 모든 요소를 readonly로 설정합니다.
 *
 * @template {object} T 파라미터의 형태
 * @param {T} object 대상 오브젝트
 * @returns {Readonly<T>} readonly한 오브젝트
 */
function nestedFreeze<T>(object: T): Readonly<T> {
    const propertyNames = Object.getOwnPropertyNames(object);

    for (const propertyName of propertyNames) {
        // @ts-ignore - 'propertyName' 요소가 'object'의 key임에도 string으로 인식되어 예외처리
        const propertyValue = object[propertyName];

        if (propertyValue && typeof propertyValue === 'object') {
            // @ts-ignore - 'propertyName' 요소가 'object'의 key임에도 string으로 인식되어 예외처리
            object[propertyName] = nestedFreeze(propertyValue);
        }
    }

    return Object.freeze(object);
}

/**
 * 파일 경로를 반환합니다.
 *
 * @param {FilePath} filePath 파일 경로 정보
 * @returns {FilePath} 파일 경로
 */
function onlyFilePath(filePath: FilePath): FilePath {
    return ObjectDefiners.onlyWereEnumerable({}, {
        fileName: filePath.fileName,
        folderPath: filePath.folderPath,
        fullPath: filePath.fullPath
    });
}

export type {
    AnyArray,
    Class,
    ClassInstance,
    ClassInstanceTuple,
    ClassTuple,
    Constructor,
    ConsturctorInstanceTuple,
    ConsturctorTuple,
    Nullable,
    PrimitiveType,
    SingleClassInstance,
    Supplier,
    Tuple,
    Undefinable
};

export {
    FileFactory,
    ObjectDefiners,
    getAllPropertyDescriptor,
    isClass,
    nestedFreeze,
    onlyFilePath,
};
