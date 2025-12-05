/**
 * 파일 정보를 제공하는 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
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
 * 고유값을 제공하는 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface Identity<T> {

    /**
     * 고유값을 반환합니다.
     * 
     * @returns {T} 고유값
     */
    get identity(): T;

}

/**
 * <code>YYYY-MM-DD</code>형태의 ISO 날짜 정보
 * 
 * @author Mux
 * @version 1.0.0
 */
type ISODate = `${string}-${string}-${string}`;

/**
 * <code>YYYY-MM-DD HH:mm:ss.SSS</code> 형태의 ISO 날짜 및 시간 정보
 * 
 * @author Mux
 * @version 1.0.0
 */
type ISODateTime = `${ISODate} ${ISOTime}`;

/**
 * <code>HH:mm:ss.SSS</code> 형태의 ISO 시간 정보
 * 
 * @author Mux
 * @version 1.0.0
 */
type ISOTime = `${string}:${string}:${string}.${string}`;

/**
 * 대상 타입 또는 <code>null</code> 타입
 * 
 * @author Mux
 * @version 1.0.0
 */
type Optional<T> = T | null;

/**
 * 읽기 전용의 {@link FilePath}
 * 
 * @author Mux
 * @version 1.0.0
 */
type ReadonlyFilePath = Readonly<FilePath>;

/**
 * 상위 및 자식 요소에 대한 읽기 전용 타입
 * 
 * @author Mux
 * @version 1.0.0
 */
type ReadonlyNested<T> = {
    readonly [key in keyof T]: T[key] extends object ? ReadonlyNested<T[key]> : T[key];
};

export type {
    Identity,
    ISODate,
    ISODateTime,
    ISOTime,
    Optional,
    ReadonlyFilePath as FilePath
};
