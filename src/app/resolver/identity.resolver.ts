import { type Identity, type FilePath } from '@model/metadata';
import { FileIdentityResolver } from '@resolver/file-identity.resolver';
import { registerService } from '@service/service.provider';
import { StringIdentityResolver } from './string-identity.resolver';

export default abstract class IdentityResolver<T, R> {

    abstract getIdentity(value: T): R;

}

registerService<IdentityResolver<Identity<string>, string>>({
    environment: 'global',
    token: IdentityResolver,
    useClass: StringIdentityResolver
});
registerService<IdentityResolver<FilePath, string>>({
    environment: 'local',
    token: IdentityResolver,
    useClass: FileIdentityResolver
});