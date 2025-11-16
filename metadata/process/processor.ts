import fileSystem from 'fs';
import path from 'path';

import { Command } from 'commander';
import { injectorConfig, type Injector } from 'lightweight-injection/injector';
import { FactoryInjectionToken } from 'lightweight-injection/injection';
import * as uuid from 'uuid';

import { type MetadataCommand, MetadataCommandParser } from '@metadata/command/command.js';
import Metadatas from '@metadata/constant.js';
import {
    type MetadataContext,
    type MetadataContexts,
    MetadataGlobalContext,
    type MetadataOptionTypeContext
} from '@metadata/context/context.js';
import { type MetadataCreatorChain } from '@metadata/creator/chain.js';
import { type MetadataContentGenerator, type MetadataFileGenerator } from '@metadata/generator/generator.js';
import { LocalComprehensive, LocalPage, LocalPost } from '@metadata/model/model.js';
import { type Processor } from '@script/process/processor.js';
import { ObjectDefiners } from '@script/util/util.js';

/**
 * 메타데이터 작업 수행 인터페이스
 * 
 * @extends {Processor<Injector, Promise<void>>}
 * @author Mux
 * @version 1.0.0
 */
interface MetadataProcessor extends Processor<Injector, Promise<void>> {}

/**
 * 메타데이터 생성 후처리 작업 수행 인터페이스
 * 
 * @extends {Prcoessor<Pair<object, MetadataContext>, void>}
 * @author Mux
 * @version 1.0.0
 */
interface MetadataCreatePostProcessor extends Processor<MetadataContexts, void> {}

/**
 * 종합 메타데이터 생성 후처리 작업 수행 클래스
 * 
 * @implements {MetadataCreatePostProcessor}
 * @author Mux
 * @version 1.0.0
 */
class LocalComprehensiveCreatorPostProcessor implements MetadataCreatePostProcessor {

    /**
     * 종합 메타데이터 생성 후처리 작업을 수행합니다.
     * 
     * @param {MetadataContexts} contexts 메타데이터 정보 튜플
     * @returns {void}
     */
    process(contexts: MetadataContexts): void {
        const object = contexts.first;

        if (object instanceof LocalComprehensive) {
            const metadataContext = contexts.second[0];

            if (metadataContext instanceof MetadataGlobalContext) {
                metadataContext.comprehensive = object
            }
        }
    }

}

/**
 * 페이지 메타데이터 생성 후처리 작업 수행 클래스
 * 
 * @implements {MetadataCreatePostProcessor}
 * @author Mux
 * @version 1.0.0
 */
class LocalPageCreatorPostProcessor implements MetadataCreatePostProcessor {

    /**
     * 페이지 메타데이터 생성 후처리 작업을 수행합니다.
     * 
     * @param {MetadataContexts} contexts 메타데이터 정보 튜플
     * @returns {void}
     */
    process(contexts: MetadataContexts): void {
        const object = contexts.first;

        if (object instanceof LocalPage) {
            const metadataContext = contexts.second[0];

            if (metadataContext instanceof MetadataGlobalContext) {
                const fileContext = contexts.second[1];

                object.fileName = fileContext.name;
                object.folderPath = fileContext.directoryPath;
                metadataContext.page = object;
            }
        }
    }

}

/**
 * 게시글 메타데이터 생성 후처리 작업 수행 클래스
 * 
 * @implements {MetadataCreatePostProcessor}
 * @author Mux
 * @version 1.0.0
 */
class LocalPostCreatorPostProcessor implements MetadataCreatePostProcessor {

    /**
     * 게시글 메타데이터 생성 후처리 작업을 수행합니다.
     * 
     * @param {MetadataContexts} contexts 메타데이터 정보 튜플
     * @returns {void}
     */
    process(contexts: MetadataContexts): void {
        const object = contexts.first;

        if (object instanceof LocalPost) {
            const metadataContext = contexts.second[0];

            if (metadataContext instanceof MetadataGlobalContext) {
                const fileContext = contexts.second[1];
                const fileNameWithoutExtensions = path.parse(fileContext.name).name;

                object.originalFileName = fileContext.name;

                if (uuid.validate(fileNameWithoutExtensions)) {
                    object.fileName = fileContext.name;
                    object.folderPath = fileContext.directoryPath;
                    metadataContext.post = object;
                }
                else {
                    const extension = path.extname(fileContext.name);
                    const options = metadataContext.options;

                    object.fileName = uuid.v7() + extension;
                    object.folderPath = options['postGeneratePath'] as string;
                    metadataContext.addPost = object;
                }
            }
        }
    }

}

/**
 * 메타데이터 명령어 추출 작업 수행 클래스
 * 
 * @implements {MetadataProcessor}
 * @author Mux
 * @version 1.0.0
 */
class MetadataCommandParseProcessor implements MetadataProcessor {

    /**
     * 메타데이터 명령어 추출 작업을 수행합니다.
     * 
     * @param {Injector} injector 의존성 주입자
     * @returns {Promise<void>}
     */
    process(injector: Injector): Promise<void> {
        const optionsValues = injector.get(Command)
            .parse(process.argv)
            .opts();
        const commandParsers = injector.get<MetadataCommandParser<unknown>[]>(Metadatas.COMMAND_PARSERS);
        const onlyEnumerableOptions = {};

        for (const commandParser of commandParsers) {
            const options = commandParser.parse(optionsValues);

            for (const key in options) {
                const value = options[key];

                ObjectDefiners.onlyEnumerable(onlyEnumerableOptions, key, value);
            }
        }

        injector.create(
            new FactoryInjectionToken(Metadatas.OPTIONS, function() {
                return onlyEnumerableOptions;
            })
        );

        return Promise.resolve();
    }

}

/**
 * 메타데이터 명령어 설정 작업 수행 클래스
 * 
 * @implements {MetadataProcessor}
 * @author Mux
 * @version 1.0.0
 */
class MetadataCommandProcessor implements MetadataProcessor {

    /**
     * 메타데이터 명령어 설정 작업을 수행합니다.
     * 
     * @param {Injector} injector 의존성 주입자
     * @returns {Promise<void>}
     */
    process(injector: Injector): Promise<void> {
        const command = injector.get(Command);
        const metadataCommands = injector.get<MetadataCommand[]>(Metadatas.COMMANDS);

        for (const metadataCommand of metadataCommands) {
            metadataCommand.commanded(command);
        }

        return Promise.resolve();
    }

}

/**
 * 메타데이터 내용 생성 작업 수행 클래스
 * 
 * @implements {MetadataProcessor}
 * @author Mux
 * @version 1.0.0
 */
class MetadataContentGenerateProcessor implements MetadataProcessor {

    /**
     * 메타데이터 내용 생성 작업을 수행합니다.
     * 
     * @param {Injector} injector 의존성 주입자
     * @returns {Promise<void>}
     */
    process(injector: Injector): Promise<void> {
        const metadataContext = injector.get<MetadataContext>(Metadatas.GLOBAL_CONTEXT);
        const metadataContentGenerators = injector.get<MetadataContentGenerator[]>('METADATA_CONTENT_GENERATORS');

        for (const metadataContentGenerator of metadataContentGenerators) {
            metadataContentGenerator.generate(injector, metadataContext);
        }

        return Promise.resolve();
    }

}

/**
 * 메타데이터 파일 생성 작업 수행 클래스
 * 
 * @implements {MetadataProcessor}
 * @author Mux
 * @version 1.0.0
 */
class MetadataFileGeneratorProcessor implements MetadataProcessor {

    /**
     * 메타데이터 생성 작업을 수행합니다.
     * 
     * @param {Injector} injector 의존성 주입자
     * @returns {Promise<void>}
     */
    async process(injector: Injector): Promise<void> {
        const metadataContext = injector.get<MetadataContext>(Metadatas.GLOBAL_CONTEXT);
        const metadataFileGenerators = injector.get<MetadataFileGenerator[]>('METADATA_FILE_GENERATORS');

        for (const metadataFileGenerator of metadataFileGenerators) {
            await metadataFileGenerator.generate(metadataContext);
        }
    }

}

/**
 * 메타데이터 초기화 작업 수행 클래스
 * 
 * @implements {MetadataProcessor}
 * @author Mux
 * @version 1.0.0
 */
class MetadataInitializeProcessor implements MetadataProcessor {

    /**
     * 폴더 전체 경로
     * 
     * @type {string}
     */
    #directoryFullPath: string;

    /**
     * {@link MetadataInitializeProcessor} 클래스의 생성자입니다.
     * 
     * @param {string} directoryFullPath 폴더 전체 경로
     */
    constructor(directoryFullPath: string) {
        this.#directoryFullPath = directoryFullPath;
    }

    /**
     * 메타데이터 초기화 작업을 수행합니다.
     * 
     * @param {Injector} injector 의존성 주입자
     * @returns {Promise<void>}
     */
    async process(injector: Injector): Promise<void> {
        injector.create(
            new FactoryInjectionToken(Metadatas.DIRECTORY_PATH, () => this.#directoryFullPath)
        );
    }

}

/**
 * 메타데이터 의존성 주입 작업 수행 클래스
 * 
 * @implements {MetadataProcessor}
 * @author Mux
 * @version 1.0.0
 */
class MetadataInjectionProcessor implements MetadataProcessor {

    /**
     * 메타데이터 의존성 주입 작업을 수행합니다.
     * 
     * @param {Injector} injector 의존성 주입자
     * @returns {Promise<void>}
     */
    async process(injector: Injector): Promise<void> {
        const directoryPath = injector.get<string>(Metadatas.DIRECTORY_PATH);
        const fileNames = await fileSystem.promises.readdir(directoryPath, {
            encoding: 'utf-8',
            recursive: true
        });

        for (const fileName of fileNames) {
            if (fileName.endsWith('.config.ts')) {
                const filePath = path.join(directoryPath, fileName);
                
                try {
                    const modules = await import(filePath);
                    const defaultModule = modules.default;

                    if (defaultModule && typeof defaultModule === 'function') {
                        const prototype = Object.getPrototypeOf(defaultModule);

                        if (prototype === injectorConfig) {
                            defaultModule(injector);
                        }
                    }
                }
                catch (error) {
                    throw error;
                }
            }
        }
    }

}

/**
 * 메타데이터 로드 작업 수행 클래스
 * 
 * @implements {MetadataProcessor}
 * @author Mux
 * @version 1.0.0
 */
class MetadataLoadProcessor implements MetadataProcessor {

    /**
     * 메타데이터 로드 작업을 수행합니다.
     * 
     * @param {Injector} injector 의존성 주입자
     * @returns {Promise<void>}
     */
    async process(injector: Injector): Promise<void> {
        const creatorsChain = injector.get<MetadataCreatorChain>(Metadatas.CREATOR_CHAIN);
        const options = injector.get<Record<string, MetadataOptionTypeContext>>(Metadatas.OPTIONS);
        const metadataContext = new MetadataGlobalContext(options);

        await creatorsChain.chain(null, metadataContext);
        
        injector.create(
            new FactoryInjectionToken(Metadatas.GLOBAL_CONTEXT, function() {
                return metadataContext;
            })
        );
    }

}

export type {
    MetadataProcessor,
    MetadataCreatePostProcessor
};

export {
    LocalComprehensiveCreatorPostProcessor,
    LocalPageCreatorPostProcessor,
    LocalPostCreatorPostProcessor,
    MetadataCommandParseProcessor,
    MetadataCommandProcessor,
    MetadataContentGenerateProcessor,
    MetadataFileGeneratorProcessor,
    MetadataInitializeProcessor,
    MetadataInjectionProcessor,
    MetadataLoadProcessor
};