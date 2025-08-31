import { FilePath } from '@model/metadata';

/**
 * 썸네일 정보를 관리하는 인터페이스입니다.
 */
interface Thumbnail extends FilePath {

    /**
     * 대체 썸네일 파일명을 반환합니다.
     *
     * @returns {string} 대체 썸네일 파일명
     */
    get alternativeFileName(): string;

    /**
     * 썸네일을 설명하는 내용을 반환합니다.
     *
     * @returns {string} 썸네일 설명 내용
     */
    get explanatoryText(): string;

}

export type {
    Thumbnail
};
