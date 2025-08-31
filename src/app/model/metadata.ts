/**
 * 파일 정보를 제공하는 인터페이스입니다.
 */
interface FilePath {

    /**
     * 파일명을 반환합니다.
     *
     * @returns {string} 파일명
     */
    get fileName(): string;

    /**
     * 폴더 경로를 반환합니다.
     *
     * @returns {string} 폴더 경로
     */
    get folderPath(): string;

    /**
     * 파일명을 포함한 전체 경로를 반환합니다.
     *
     * @returns {string} 전체 경로
     */
    get fullPath(): string;

}

/**
 * <code>YYYY-MM-DD</code>형태의 ISO 날짜 정보
 */
type ISODate = `${string}-${string}-${string}`;

/**
 * <code>YYYY-MM-DD HH:mm:ss.SSS</code> 형태의 ISO 날짜 및 시간 정보
 */
type ISODateTime = `${ISODate} ${ISOTime}`;

/**
 * <code>HH:mm:ss.SSS</code> 형태의 ISO 시간 정보
 */
type ISOTime = `${string}:${string}:${string}.${string}`;

/**
 * JSON 직렬화 인터페이스
 */
interface JSONSerializer<T> {

    /**
     * JSON 형태로 직렬화하여 반환합니다.
     *
     * @ignore {@link JSON#stringify}에서 자동으로 호출}
     * @template T
     * @returns {ReadonlyNested<T>} JSON 데이터
     */
    toJSON(): ReadonlyNested<T>

}

type Optional<T> = T | null;

type ReadonlyFilePath = Readonly<FilePath>;

type ReadonlyNested<T> = {
    readonly [key in keyof T]: T[key] extends object ? ReadonlyNested<T[key]> : T[key];
};

interface Serializer<T, R> {

    /**
     * {@link T}타입의 데이터를 받아 {@link R}타입으로 변환하여 반환합니다.
     *
     * @template {T} T 입력 데이터 타입
     * @template {R} R 반환 데이터 타입
     * @param {T} target 변환 대상 데이터
     * @returns {R} 변환 데이터
     */
    serialize(target: T): R;

}

export type {
    ISODate,
    ISODateTime,
    ISOTime,
    JSONSerializer,
    Optional,
    ReadonlyFilePath as FilePath,
    Serializer
};
