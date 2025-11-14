import { type Constructor } from '@script/util/util';

/**
 * 빌더 인터페이스
 *
 * @template R 반환 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface Builder<R> {

    /**
     * 개체를 생성하여 반환합니다.
     *
     * @returns {R} 개체
     */
    build(): R

}

/**
 * 빌더 클래스 생성자 유형
 * 
 * @template R 반환 개체 유형
 * @author Mux
 * @version 1.0.0
 */
type BuilderConstructor<R> = Constructor<Builder<R>>;

/**
 * 빌더 클래스 객체 유형
 * 
 * @template R 반환 빌더 클래스 유형
 * @author Mux
 * @version 1.0.0
 */
type BuilderInstance<R extends BuilderConstructor<R>> = InstanceType<R>;

export type {
    Builder,
    BuilderConstructor,
    BuilderInstance
};