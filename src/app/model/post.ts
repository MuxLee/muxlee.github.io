import { FilePath, ISODateTime } from '@model/metadata';
import { Thumbnail } from '@model/thumbnail';

/**
 * 게시글 정보를 관리하는 인터페이스입니다.
 */
interface Post extends FilePath {

    /**
     * 카테고리 목록을 반환합니다.
     *
     * @returns {Set<string>} 카테고리 목록
     */
    get categories(): Set<string>;

    /**
     * 게시글을 요약한 내용을 반환합니다.
     *
     * @returns {string} 게시글 요약 내용
     */
    get summation(): string;

    /**
     * 게시글 썸네일 정보를 반환합니다.
     *
     * @returns {Thumbnail} 썸네일 정보
     */
    get thumbnail(): Thumbnail;

    /**
     * 게시글 제목을 반환합니다.
     *
     * @returns {string} 게시글 제목
     */
    get title(): string;

    /**
     * 게시글 작성일자를 반환합니다.
     *
     * @returns {ISODateTime} 작성일자
     */
    get writeDateTime(): ISODateTime;

}

type ReadonlyPost = Readonly<Post>;

export type {
    ReadonlyPost as Post
};
