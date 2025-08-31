import { FilePath } from '@domain/metadata';

type ReadonlyFilePathArray = ReadonlyArray<FilePath>;

/**
 * 카테고리 정보를 관리하는 인터페이스입니다.
 */
interface Category {

    /**
     * 카테고리 개수를 반환합니다.
     *
     * @returns {number} 카테고리 개수
     */
    get count(): number;

    /**
     * 카테고리명을 반환합니다.
     *
     * @returns {string} 카테고리명
     */
    get name(): string;

    /**
     * 게시글 파일 경로 목록을 반환합니다.
     *
     * @returns {ReadonlyFilePathArray} 게시글 파일 경로 목록
     */
    get postFilePaths(): ReadonlyFilePathArray;

}

type ReadonlyCategory = Readonly<Category>;

export type {
    ReadonlyCategory as Category
};
