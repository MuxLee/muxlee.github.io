/**
 * 작업 수행기 인터페이스
 *
 * @template T 개체 유형
 * @template R 반환 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface Processor<T, R> {

    /**
     * 작업을 수행하여 반환합니다.
     *
     * @param {T} object 개체
     * @returns {R} 개체
     */
    process(object: T): R;

}

/**
 * 빈-작업 수행 클래스
 * 
 * @implements {Processor<unknown, void>}
 * @author Mux
 * @version 1.0.0
 */
class EmptyConsumerProcessor implements Processor<unknown, void> {

    /**
     * 어떠한 작업도 수행하지 않습니다.
     * 
     * @param {unknown} object 개체
     * @returns {void}
     */
    process(object: unknown): void {}

}

export type {
    Processor
};

export {
    EmptyConsumerProcessor
};