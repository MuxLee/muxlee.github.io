import type { OptionValues } from 'commander';
import { Command } from 'commander';

import { ObjectDefiners } from '@script/util/util.js';

/**
 * 메타데이터 명령어 인터페이스
 * 
 * @author Mux
 * @version 1.0.0
 */
interface MetadataCommand {

    /**
     * 메타데이터 명령어를 설정합니다.
     * 
     * @param {Command} command 명령어 모듈
     * @returns {void}
     */
    commanded(command: Command): void;

}

/**
 * 메타데이터 명령어 추출 인터페이스
 * 
 * @template {MetadataOptionTypeContext} R 반환 개체 유형
 * @author Mux
 * @version 1.0.0
 */
interface MetadataCommandParser<R> {

    /**
     * 메타데이터 명령어를 추출합니다.
     * 
     * @param optionValues 명령어 목록
     * @returns {Record<string, R>} 명령어 개체
     */
    parse(optionValues: OptionValues): Record<string, R>;

}

/**
 * 종합 메타데이터 명령어 클래스
 * 
 * @implements {MetadataCommand}
 * @author Mux
 * @version 1.0.0
 */
class LocalComprehensiveCommand implements MetadataCommand {

    /**
     * 종합 메타데이터 명령어를 설정합니다.
     * 
     * @param {Command} command 명령어 모듈
     * @returns {void}
     */
    commanded(command: Command): void {
        command.option('--cgf <string>', '종합 메타데이터가 생성될 때, 사용할 파일명을 설정합니다.', 'comprehensive.json');
        command.option('--cgp <string>', '종합 메타데이터 파일을 생성할 경로를 설정합니다.');
        command.option('--clf <string>', '종합 메타데이터를 불러올 때, 사용할 파일명을 설정합니다.', 'comprehensive.json');
        command.option('--clp <string>', '종합 메타데이터 파일을 불러올 경로를 설정합니다.');
    }

}

/**
 * 종합 메타데이터 명령어 추출 클래스
 * 
 * @implements {MetadataCommandParser<string>}
 * @author Mux
 * @version 1.0.0
 */
class LocalComprehensiveCommandParser implements MetadataCommandParser<string> {

    /**
     * 종합 메타데이터 명령어를 추출합니다.
     * 
     * @param {OptionValues} optionValues 명령어 목록
     * @returns {Record<string, string>} 종합 명령어 개체
     */
    parse(optionValues: OptionValues): Record<string, string> {
        return ObjectDefiners.onlyWereEnumerable({}, {
            comprehensiveGenerateFileName: optionValues['cgf'],
            comprehensiveGeneratePath: optionValues['cgp'],
            comprehensiveLoadFileName: optionValues['clf'],
            comprehensiveLoadPath: optionValues['clp']
        });
    }

}

/**
 * 페이지 메타데이터 명령어 클래스
 * 
 * @implements {MetadataCommand}
 * @author Mux
 * @version 1.0.0
 */
class LocalPageCommand implements MetadataCommand {

    /**
     * 페이지 메타데이터 명령어를 설정합니다.
     * 
     * @param {Command} command 명령어 모듈
     * @returns {void}
     */
    commanded(command: Command): void {
        command.option('--pagp <string>', '페이지 메타데이터 파일을 생성할 경로를 설정합니다.');
    }

}

/**
 * 페이지 메타데이터 명령어 추출 클래스
 * 
 * @implements {MetadataCommandParser<string>}
 * @author Mux
 * @version 1.0.0
 */
class LocalPageCommandParser implements MetadataCommandParser<string> {

    /**
     * 페이지 메타데이터 명령어를 추출합니다.
     * 
     * @param {OptionValues} optionValues 명령어 목록
     * @returns {Record<string, string>} 페이지 명령어 개체
     */
    parse(optionValues: OptionValues): Record<string, string> {
        return ObjectDefiners.onlyWereEnumerable({}, {
            pageGeneratePath: optionValues['pagp']
        });
    }

}

/**
 * 게시글 메타데이터 명령어 클래스
 * 
 * @implements {MetadataCommand}
 * @author Mux
 * @version 1.0.0
 */
class LocalPostCommand implements MetadataCommand {

    /**
     * 페이지 메타데이터 명령어를 설정합니다.
     * 
     * @param {Command} command 명령어 모듈
     * @returns {void}
     */
    commanded(command: Command): void {
        command.option('--pogp <string>', '게시글 메타데이터 파일을 생성할 경로를 설정합니다.');
        command.option('--pole <string>', '게시글 파일을 불러올 때, 대상이 될 확장자 목록을 설정합니다.', '.generate.md');
        command.option('--polp <string>', '게시글 메타데이터 파일을 불러올 경로를 설정합니다.');
    }

}

/**
 * 게시글 메타데이터 명령어 추출 클래스
 * 
 * @implements {MetadataCommandParser<string>}
 * @author Mux
 * @version 1.0.0
 */
class LocalPostCommandParser implements MetadataCommandParser<string> {

    /**
     * 게시글 메타데이터 명령어를 추출합니다.
     * 
     * @param {OptionValues} optionValues 명령어 목록
     * @returns {Record<string, string>} 게시글 명령어 개체
     */
    parse(optionValues: OptionValues): Record<string, string> {
        return ObjectDefiners.onlyWereEnumerable({}, {
            postGeneratePath: optionValues['pogp'],
            postLoadExtension: optionValues['pole'],
            postLoadPath: optionValues['polp']
        });
    }

}

/**
 * 메타데이터 로더 명령어 인터페이스
 * 
 * @implements {MetadataCommand}
 * @author Mux
 * @version 1.0.0
 */
class MetadataLoaderCommand implements MetadataCommand {

    /**
     * 메타데이터 로더 명령어를 설정합니다.
     * 
     * @param {Command} command 명령어 모듈
     * @returns {void}
     */
    commanded(command: Command): void {
        command.option('--async <string>', '비동기로 작업을 수행할지 설정합니다.', 'false');
        command.option('--root-dir <string>', '최상위 폴더를 설정합니다.');
        command.option('--timeout <number>', '파일을 불러오는 제한시간을 설정합니다.', '5000');
    }

}

/**
 * 메타데이터 로더 명령어 추출 클래스
 * 
 * @implements {MetadataCommandParser<boolean | number>}
 * @author Mux
 * @version 1.0.0
 */
class MetadataLoaderCommandParser implements MetadataCommandParser<boolean | number> {

    /**
     * 메타데이터 로더 명령어를 추출합니다.
     * 
     * @param {OptionValues} optionValues 명령어 목록
     * @returns {Record<string, boolean | number>} 로더 명령어 개체
     */
    parse(optionValues: OptionValues): Record<string, boolean | number> {
        const rootDirectory = optionValues['rootDir'];
        const timeout = Number.parseInt(optionValues['timeout']);
        const useAsync = Boolean(optionValues['async']);

        return ObjectDefiners.onlyWereEnumerable({}, {
            rootDirectory,
            timeout,
            useAsync
        });
    }

}

export type {
    MetadataCommand,
    MetadataCommandParser
};

export {
    LocalComprehensiveCommand,
    LocalComprehensiveCommandParser,
    LocalPageCommand,
    LocalPageCommandParser,
    LocalPostCommand,
    LocalPostCommandParser,
    MetadataLoaderCommand,
    MetadataLoaderCommandParser
};