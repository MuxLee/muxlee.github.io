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
export type {
    FileDataPair,
    Pair
};