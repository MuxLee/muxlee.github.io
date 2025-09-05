import jsYaml from 'js-yaml';

const metadataRegExp = /^(?<=-{3}\n)(.|\s)*?(?=\n---)/m;

/**
 * @template T
 * @template R
 * @interface
 */
class Extractor {

    /**
     * {@link T}타입의 데이터를 받아 {@link R}타입의 데이터로
     * 변환하여 반환합니다.
     *
     * @param {T} value 데이터
     * @param {string} type 데이터의 타입
     * @returns {R} 변환 데이터
     */
    extract(value, type) {
        throw new Error('Method not implemented.');
    }

}

/**
 * @implements {Extractor<string, string | null>}
 */
class MetadataExtractor {

    /**
     * 문자열 데이터를 받아 문자열 속에서 메타데이터 정규 표현식
     * 조건에 부합하는 부분을 추출하여 반환합니다.
     *
     * @param {string} value 문자열 데이터
     * @param {string} type 데이터의 타입
     * @returns {string | null} 메타데이터 문자열 데이터
     */
    extract(value, type) {
        if (type === 'string') {
            const matchesGroup = value.match(metadataRegExp);

            if (matchesGroup && matchesGroup.length) {
                return matchesGroup[0];
            }
        }

        return null;
    }

}

/**
 * @template T
 * @implements {Extractor<string, T | null>}
 */
class ObjectExtractor {

    /**
     * 문자열을 받아 키-값 형태의 정규 표현식 조건에 부합하는
     * 부분을 추출하여 반환합니다.
     *
     * @param {string} value 문자열 데이터
     * @param type 데이터의 타입
     * @returns {object | null} 키-값 형태의 오브젝트 데이터
     */
    extract(value, type) {
        if (type === 'string') {
            return jsYaml.load(value);
        }

        return null;
    }

}

/**
 * @type {Extractor[]}
 */
const extractors = [];

extractors.push(new MetadataExtractor());
extractors.push(new ObjectExtractor());

/**
 * 텍스트로부터 메타데이터 영역을 추출하여 반환합니다.
 *
 * @template T
 * @param {string} text 탐색할 텍스트
 * @returns {T | null} 메타데이터 텍스트
 */
function extractMetadata(text) {
    return extractors.reduce((value, extractor) =>
        extractor.extract(value, typeof(value)), text);
}

/**
 * 중첩 오브젝트의 모든 요소를 readonly로 설정합니다.
 *
 * @template T 파라미터의 형태
 * @param {T} object 대상 오브젝트
 * @returns {Readonly<T>} readonly한 오브젝트
 */
function nestedFreeze(object) {
    const propertyNames = Object.getOwnPropertyNames(object);

    for (const propertyName of propertyNames) {
        const propertyValue = object[propertyName];

        if (propertyValue && typeof propertyValue === 'object') {
            object[propertyName] = nestedFreeze(propertyValue);
        }
    }

    return Object.freeze(object);
}

export {
    extractMetadata,
    nestedFreeze
};
