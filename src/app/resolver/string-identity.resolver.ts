import { type Identity } from '@model/metadata';
import IdentityResolver from '@resolver/identity.resolver';

export class StringIdentityResolver implements IdentityResolver<Identity<string>, string> {

    getIdentity(identity: Identity<string>): string {
        return identity.identity;
    }
    
}