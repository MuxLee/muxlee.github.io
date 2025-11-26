import { LocalComprehensive, LocalPage, LocalPost } from '@metadata/model/model';
import type { Comprehensive, Page, Post } from '@metadata/model/model';
import type { Deserializer, Serializer } from '@script/serialize/serializer';
import type { Class, PrimitiveType, Undefinable } from '@script/util/util';
import { ObjectDefiners } from '@script/util/util';

/**
 * 메타데이터 역직렬화 클래스
 *
 * @protected
 * @template R 반환 메타데이터 유형
 * @implements {Deserializer<object, R>}
 * @author Mux
 * @version 1.0.0
 */
class _MetadataDeserializer<R> implements Deserializer<object, R> {

    /**
     * 개체를 메타데이터로 역직렬화하여 반환합니다.
     *
     * @param {object} object 개체
     * @returns {R} 메타데이터
     */
    deserialize(object: object): R {
        throw new Error('\'deserializer\' 메소드가 구현되지 않았습니다.');
    }

    /**
     * 메타데이터로 역직렬화 가능한지 판별합니다.
     *
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 역직렬화 가능여부
     */
    supports<T>(object: T): boolean {
        return !!object && typeof object === 'object';
    }

    /**
     * 속성이 개체에 존재하는지 판별합니다.
     *
     * @template T 개체 유형
     * @template {Class} S 객체 유형
     * @param {T} object 개체
     * @param {string} propertyName 속성명
     * @param {PrimitiveType} primitiveType 원시 유형
     * @param {Undefinable<S>} instanceType 객체
     * @returns {boolean} 속성 존재 여부
     */
    _isMatchedProperty<T, S extends Class>(object: T, propertyName: string, primitiveType: PrimitiveType, instanceType?: Undefinable<S>): boolean {
        let hasProperty = false;

        if (!!object && typeof object === 'object') {
            hasProperty = 'hasOwnProperty' in object
                ? object.hasOwnProperty(propertyName)
                : propertyName in object;
        }

        // @ts-ignore - 'Record<string, any>'로 제한할 수 없어 예외처리
        const isInstanceOf = !!instanceType ? object[propertyName] instanceof instanceType : true;

        // @ts-ignore - 'Record<string, any>'로 제한할 수 없어 예외처리
        return hasProperty && isInstanceOf && typeof object[propertyName] === primitiveType;
    }

}

/**
 * 메타데이터 직렬화 클래스
 *
 * @protected
 * @template T 메타데이터 유형
 * @implements {Serializer<T, string>}
 * @author Mux
 * @version 1.0.0
 */
class _MetadataSerializer<T> implements Serializer<T, string> {

    /**
     * 메타데이터를 문자열로 직렬화하여 반환합니다.
     *
     * @param {T} metadata 메타데이터
     * @returns {string} 문자열
     */
    serialize(metadata: T): string {
        const pickMetadata = this._pickMetadata(metadata);

        return JSON.stringify(pickMetadata, null, 4);
    }

    /**
     * 개체가 직렬화 가능한지 판별합니다.
     *
     * @template S 개체 유형
     * @param {S} object 개체
     * @returns {boolean} 직렬화 가능여부
     */
    supports<S>(object: S): boolean {
        return !!object && typeof object === 'object';
    }

    /**
     * 메타데이터를 가공하여 반환합니다.
     *
     * @protected
     * @param {T} metadata 메타데이터
     * @returns {object} 개체
     */
    _pickMetadata(metadata: T): object {
        throw new Error('\'_pickMetadata\' 메소드가 구현되지 않았습니다.');
    }

}

/**
 * 정보 메타데이터 역직렬화 클래스
 *
 * @extends {_MetadataDeserializer<Comprehensive>}
 * @author Mux
 * @version 1.0.0
 */
class LocalComprehensiveDeserializer extends _MetadataDeserializer<Comprehensive> {

    /**
     * 정보 메타데이터로 역직렬화하여 반환합니다.
     *
     * @override
     * @param {Comprehensive} object 개체
     * @returns {Comprehensive} 정보 메타데이터
     */
    override deserialize(object: Comprehensive): Comprehensive {
        return new LocalComprehensive(object);
    }

    /**
     * 개체가 정보 메타데이터로 역직렬화 가능한지 판별합니다.
     *
     * @override
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 역직렬화 가능여부
     */
    override supports<T>(object: T): boolean {
        return super.supports(object)
            && super._isMatchedProperty(object, 'categories', 'object')
            && super._isMatchedProperty(object, 'categoryCount', 'number')
            && super._isMatchedProperty(object, 'latestCategories', 'object', Array)
            && super._isMatchedProperty(object, 'pageCount', 'number')
            && super._isMatchedProperty(object, 'pages', 'object', Array)
            && super._isMatchedProperty(object, 'postCount', 'number');
    }

}

/**
 * 정보 메타데이터 직렬화 클래스
 *
 * @extends {_MetadataSerializer<Comprehensive>}
 * @author Mux
 * @version 1.0.0
 */
class LocalComprehensiveSerializer extends _MetadataSerializer<Comprehensive> {

    /**
     * 개체가 정보 메타데이터 유형이며, 직렬화 가능한지 판별합니다.
     *
     * @override
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 직렬화 가능여부
     */
    override supports<T>(object: T): boolean {
        return super.supports(object) && object instanceof LocalComprehensive;
    }

    /**
     * 정보 메타데이터를 가공하여 반환합니다.
     *
     * @override
     * @protected
     * @param {Comprehensive} comprehensive 정보 메타데이터
     * @returns {object} 개체
     */
    override _pickMetadata(comprehensive: Comprehensive): object {
        return ObjectDefiners.onlyWereEnumerable({}, {
            categories: global.Object.fromEntries(comprehensive.categories),
            categoryCount: comprehensive.categoryCount,
            latestCategories: comprehensive.latestCategories,
            latestPage: comprehensive.latestPage,
            latestPost: comprehensive.latestPost,
            pageCount: comprehensive.pageCount,
            pages: comprehensive.pages,
            postCount: comprehensive.postCount
        });
    }

}

/**
 * 페이지 메타데이터 역직렬화 클래스
 *
 * @extends {_MetadataDeserializer<Page>}
 * @author Mux
 * @version 1.0.0
 */
class LocalPageDeserializer extends _MetadataDeserializer<Page> {

    /**
     * 페이지 메타데이터로 역직렬화하여 반환합니다.
     *
     * @override
     * @param {Page} object 개체
     * @returns {Page} 페이지 메타데이터
     */
    override deserialize(object: Page): Page {
        return new LocalPage(object);
    }

    /**
     * 개체가 페이지 메타데이터로 역직렬화 가능한지 판별합니다.
     *
     * @override
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 역직렬화 가능여부
     */
    override supports<T>(object: T): boolean {
        return super.supports(object)
            && super._isMatchedProperty(object, 'fileName', 'string')
            && super._isMatchedProperty(object, 'folderPath', 'string')
            && super._isMatchedProperty(object, 'posts', 'object', Array);
    }

}

/**
 * 페이지 메타데이터 직렬화 클래스
 *
 * @extends {_MetadataSerializer<Page>}
 * @author Mux
 * @version 1.0.0
 */
class LocalPageSerializer extends _MetadataSerializer<Page> {

    /**
     * 개체가 페이지 메타데이터 유형이며, 직렬화 가능한지 판별합니다.
     *
     * @override
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 직렬화 가능여부
     */
    override supports<T>(object: T): boolean {
        return super.supports(object) && object instanceof LocalPage;
    }

    /**
     * 페이지 메타데이터를 가공하여 반환합니다.
     *
     * @override
     * @protected
     * @param {Page} page 페이지 메타데이터
     * @returns {object} 개체
     */
    override _pickMetadata(page: Page): object {
        return ObjectDefiners.onlyWereEnumerable({}, {
            fileName: page.fileName,
            folderPath: page.folderPath,
            fullPath: page.fullPath,
            nextPage: page.nextPage,
            previousPage: page.previousPage,
            posts: page.posts,
            postCount: page.postCount
        });
    }

}

/**
 * 게시글 메타데이터 역직렬화 클래스
 *
 * @extends {_MetadataDeserializer<Post>}
 * @author Mux
 * @version 1.0.0
 */
class LocalPostDeserializer extends _MetadataDeserializer<Post> {

    /**
     * 게시글 메타데이터로 역직렬화하여 반환합니다.
     *
     * @override
     * @param {Post} object 개체
     * @returns {Post} 게시글 메타데이터
     */
    override deserialize(object: Post): Post {
        return new LocalPost(object);
    }

    /**
     * 개체가 게시글 메타데이터로 역직렬화 가능한지 판별합니다.
     *
     * @override
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 역직렬화 가능여부
     */
    override supports<T>(object: T): boolean {
        return super.supports(object)
            && super._isMatchedProperty(object, 'categories', 'object', Array)
            && super._isMatchedProperty(object, 'summation', 'string')
            && super._isMatchedProperty(object, 'thumbnail', 'object')
            && super._isMatchedProperty(object, 'title', 'string')
            && super._isMatchedProperty(object, 'writeDateTime', 'string');
    }

}

/**
 * 게시글 메타데이터 직렬화 클래스
 *
 * @extends {_MetadataSerializer<Post>}
 * @author Mux
 * @version 1.0.0
 */
class LocalPostSerializer extends _MetadataSerializer<Post> {

    /**
     * 개체가 게시글 메타데이터 유형이며, 직렬화 가능한지 판별합니다.
     *
     * @override
     * @template T 개체 유형
     * @param {T} object 개체
     * @returns {boolean} 직렬화 가능여부
     */
    override supports<T>(object: T): boolean {
        return super.supports(object) && object instanceof LocalPost;
    }

    /**
     * 게시글 메타데이터를 가공하여 반환합니다.
     *
     * @override
     * @protected
     * @param {Post} post 게시글 메타데이터
     * @returns {object} 개체
     */
    override _pickMetadata(post: Post): object {
        return ObjectDefiners.onlyWereEnumerable({}, {
            fileName: post.fileName,
            folderPath: post.folderPath,
            fullPath: post.fullPath,
            nextPage: post.nextPost,
            previousPage: post.previousPost
        });
    }

}

export {
    LocalComprehensiveDeserializer,
    LocalComprehensiveSerializer,
    LocalPageDeserializer,
    LocalPageSerializer,
    LocalPostDeserializer,
    LocalPostSerializer
};