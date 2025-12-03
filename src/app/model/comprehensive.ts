import { Category } from '@model/category';
import { Optional } from '@model//metadata';
import { Page } from '@model/page';
import { Post } from '@model/post';

type ReadonlyCategoryMap = ReadonlyMap<string, Category>;
type ReadonlyCategorySet = ReadonlySet<string>;

/**
 * 페이지와 카테고리, 게시글들에 대한 포괄적인 정보를 담당하는 인터페이스입니다.
 */
interface Comprehensive {

    /**
     * 모든 카테고리 정보를 반환합니다.
     *
     * @returns {ReadonlyCategoryMap} 카테고리 정보
     */
    get categories(): ReadonlyCategoryMap;

    /**
     * 카테고리의 개수를 반환합니다.
     *
     * @returns {number} 카테고리 개수
     */
    get categoryCount(): number;

    /**
     * 가장 최근에 업데이트된 카테고리 목록을 반환합니다.
     *
     * @returns {ReadonlyCategorySet} 카테고리 목록
     */
    get latestCategories(): ReadonlyCategorySet;

    /**
     * 가장 최근에 업데이트된 페이지 정보를 반환합니다.
     *
     * @returns {Optional<Page>} 페이지 정보
     */
    get latestPage(): Optional<Page>;

    /**
     * 최신 업데이트된 게시글 정보를 반환합니다.
     *
     * @returns {Optional<Post>} 게시글 정보
     */
    get latestPost(): Optional<Post>;

    /**
     * 페이지의 개수를 반환합니다.
     *
     * @returns {number} 페이지 개수
     */
    get pageCount(): number;

    /**
     * 모든 페이지 목록을 반환합니다.
     *
     * @returns {Page[]} 페이지 목록
     */
    get pages(): Page[];

    /**
     * 게시글 개수를 반환합니다.
     *
     * @returns {number} 게시글 개수
     */
    get postCount(): number;

}

type ReadonlyComprehensive = Readonly<Comprehensive>;

export type {
    ReadonlyComprehensive as Comprehensive
};