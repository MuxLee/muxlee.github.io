import { FilePath } from '@model/metadata';
import { Post } from '@model/post';

type ReadonlyPostArray = ReadonlyArray<Post>;

/**
 * 게시글 정보를 정해진 개수로 관리하는 인터페이스입니다.
 */
interface Page extends FilePath {

    /**
     * 게시글 목록 반환합니다.
     *
     * @returns {ReadonlyPostArray} 게시글 목록
     */
    get posts(): ReadonlyPostArray;

    /**
     * 게시글 개수를 반환합니다.
     *
     * @returns {number} 게시글 개수
     */
    get postCount(): number;

}

type ReadonlyPage = Readonly<Page>;

export type {
    ReadonlyPage as Page
};
