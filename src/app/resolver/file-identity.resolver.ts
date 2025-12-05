import { type FilePath } from '@model/metadata';
import IdentityResolver from '@resolver/identity.resolver';

export class FileIdentityResolver implements IdentityResolver<FilePath, string> {

    getIdentity(filePath: FilePath): string {
        return filePath.fullPath;
    }

}