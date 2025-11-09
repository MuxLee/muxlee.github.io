import type { MetadataContext, MetadataContextFactory } from '@metadata/context/context.js';
import type { MetadataCreatorChain } from '@metadata/creator/chain.js';
import type { MetadataCreatePostProcessor } from '@metadata/process/processor.js';
import type { FileDataPair } from '@script/collection/collection.js';
import { SimplePair, TuplePair } from '@script/collection/collection.js';
import type { FileContext } from '@script/context/context.js';
import type { FileLoader } from '@script/loader/loader.js';
import type { Deserializer } from '@script/serialize/serializer.js';

/**
 * 메타데이터 생성기 인터페이스
 *
 * @template T 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface MetadataCreator<T> {

    /**
     * 메타데이터 정보를 생성합니다.
     *
     * @param {T} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @param {MetadataCreatorChain} creatorChain 메타데이터 생성기 체인
     * @returns {Promise<void>}
     */
    create(object: T, metadataContext: MetadataContext, creatorChain: MetadataCreatorChain): Promise<void>;

}

/**
 * 메타데이터 내용 생성기 클래스
 *
 * @implements {MetadataCreator<FileContext[]>}
 * @author Mux
 * @version 1.0.0
 */
class MetadataContentCreator implements MetadataCreator<FileContext[]> {

    /**
     * 파일 로더
     *
     * @type {FileLoader<unknown>}
     */
    #fileLoader: FileLoader<unknown>;

    /**
     * {@link MetadataContentCreator} 클래스의 생성자입니다.
     *
     * @param {FileLoader<unknown>} fileLoader 파일 로더
     */
    constructor(fileLoader: FileLoader<unknown>) {
        this.#fileLoader = fileLoader;
    }

    /**
     * 메타데이터 내용을 생성합니다.
     *
     * @param {FileContext[]} fileContexts 메타데이터 파일 정보 목록
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @param {MetadataCreatorChain} creatorChain 메타데이터 생성기 체인
     * @returns {Promise<void>}
     */
    async create(fileContexts: FileContext[], metadataContext: MetadataContext, creatorChain: MetadataCreatorChain): Promise<void> {
        const promises = [];

        for (const fileContext of fileContexts) {
            if (fileContext) {
                const promise = this._getContent(fileContext);

                promises.push(promise);
            }
        }

        const fileDataPairs = await Promise.all(promises);

        await creatorChain.chain(fileDataPairs, metadataContext);
    }

    /**
     * 메타데이터 내용을 반환합니다.
     *
     * @param {FileContext} fileContext 메타데이터 파일 정보
     * @returns {Promise<FileDataPair>} 메타데이터 내용 쌍
     */
    async _getContent(fileContext: FileContext): Promise<FileDataPair> {
        if (this.#fileLoader.supports(fileContext)) {
            let fileObject = this.#fileLoader.load(fileContext);

            if (fileObject instanceof Promise) {
                fileObject = await fileObject;
            }

            const content = await fileObject.text();
            
            return new SimplePair(content, fileContext);
        }

        throw new Error('메타데이터 파일을 불러올 수 없습니다.');
    }

}

/**
 * 메타데이터 정보 생성기 클래스
 *
 * @implements {MetadataCreator<null>}
 * @author Mux
 * @version 1.0.0
 */
class MetadataContextCreator implements MetadataCreator<null> {

    /**
     * 메타데이터 정보 생성기 목록
     *
     * @type {MetadataContextFactory<unknown, unknown>[]}
     */
    #contextFactories: MetadataContextFactory<unknown, unknown>[];

    /**
     * {@link MetadataContextCreator} 클래스의 생성자입니다.
     */
    constructor() {
        this.#contextFactories = [];
    }

    /**
     * 메타데이터 정보를 생성합니다.
     *
     * @param {unknown} object 개체
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @param {MetadataCreatorChain} creatorChain 메타데이터 생성기 체인
     * @returns {Promise<void>}
     */
    async create(object: unknown, metadataContext: MetadataContext, creatorChain: MetadataCreatorChain): Promise<void> {
        if (this.#contextFactories.length > 0) {
            const fileContexts = this.#contextFactories.map(function (contextFactory) {
                return contextFactory.factory(object, metadataContext);
            }).filter(function(context) {
                return !!context;
            }).flat();

            await creatorChain.chain(fileContexts, metadataContext);
        }
    }

    /**
     * 메타데이터 정보 생성기를 등록합니다.
     *
     * @param {MetadataContextFactory<unknown, unknown>} contextFactory 메타데이턴 정보 생성기
     * @returns {void}
     */
    registerContextFactory(contextFactory: MetadataContextFactory<unknown, unknown>): void {
        this.#contextFactories.push(contextFactory);
    }

}

/**
 * 메타데이터 객체 생성기 클래스
 *
 * @implements {MetadataCreator<FileDataPair[]>}
 * @author Mux
 * @version 1.0.0
 */
class MetadataObjectCreator implements MetadataCreator<FileDataPair[]> {

    /**
     * 개체 역직렬화 목록
     *
     * @type {Deserializer<object | string, object>[]}
     */
    #deserializers: Deserializer<object | string, object>[];

    /**
     * 메타데이터 생성 후처리 작업자 목록
     *
     * @type {MetadataCreatePostProcessor[]}
     */
    #postProcessors: MetadataCreatePostProcessor[];

    /**
     * {@link MetadataObjectCreator} 클래스의 생성자입니다.
     */
    constructor() {
        this.#deserializers = [];
        this.#postProcessors = [];
    }

    /**
     * 메타데이터 객체를 생성합니다.
     *
     * @param {FileDataPair[]} fileDataPairs 파일 개체 쌍 목록
     * @param {MetadataContext} metadataContext 메타데이터 정보
     * @param {MetadataCreatorChain} creatorChain 메타데이터 생성기 체인
     * @returns {Promise<void>}
     */
    async create(fileDataPairs: FileDataPair[], metadataContext: MetadataContext, creatorChain: MetadataCreatorChain): Promise<void> {
        const postFileDataPairs = [];

        for (const { first: content, second: fileContext } of fileDataPairs) {
            let temporaryContent: object | string = content;

            for (const deserializer of this.#deserializers) {
                if (deserializer.supports(temporaryContent)) {
                    temporaryContent = deserializer.deserialize(temporaryContent);
                }
            }

            if (typeof temporaryContent === 'object') {
                const postFileDataPair = new TuplePair(temporaryContent, [metadataContext, fileContext]);

                postFileDataPairs.push(postFileDataPair);
            }
        }

        for (const postFileDataPair of postFileDataPairs) {
            for (const postProcessor of this.#postProcessors) {
                postProcessor.process(postFileDataPair);
            }
        }

        await creatorChain.chain(null, metadataContext);
    }

    /**
     * 개체 역직렬화를 등록합니다.
     *
     * @template {object} T 개체 유형
     * @param {Deserializer<object | string, T>} deserializer 개체 역직렬화
     * @returns {void}
     */
    registerDeserializer<T extends object>(deserializer: Deserializer<object | string, T>): void {
        this.#deserializers.push(deserializer);
    }

    /**
     * 메타데이터 생성 후처리 작업자 목록를 등록합니다.
     *
     * @param {MetadataCreatePostProcessor} postProcessor 메타데이터 생성 후처리 작업자
     * @returns {void}
     */
    registerProcessors(postProcessor: MetadataCreatePostProcessor): void {
        this.#postProcessors.push(postProcessor);
    }

}

export type {
    MetadataCreator
};

export {
    MetadataContentCreator,
    MetadataContextCreator,
    MetadataObjectCreator
};