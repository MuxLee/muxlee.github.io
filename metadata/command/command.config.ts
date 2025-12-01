import { Command } from 'commander';
import { ArrayInjectionToken } from 'lightweight-injection/injection';
import { type CreateInjector, injectorConfig } from 'lightweight-injection/injector';

import {
    LocalComprehensiveCommand,
    LocalComprehensiveCommandParser,
    LocalPageCommand,
    LocalPageCommandParser,
    LocalPostCommand,
    LocalPostCommandParser,
    MetadataLoaderCommand,
    MetadataLoaderCommandParser
} from '@metadata/command/command.js';
import Metadatas from '@metadata/constant.js';

export default injectorConfig(function(injector: CreateInjector) {
    injector.create(Command);
    injector.create(new ArrayInjectionToken(Metadatas.COMMAND_PARSERS, [
        LocalComprehensiveCommandParser,
        LocalPageCommandParser,
        LocalPostCommandParser,
        MetadataLoaderCommandParser
    ]));
    injector.create(new ArrayInjectionToken(Metadatas.COMMANDS, [
        LocalComprehensiveCommand,
        LocalPageCommand,
        LocalPostCommand,
        MetadataLoaderCommand
    ]));
}, '메타데이터 명령어 설정/추출 의존성');