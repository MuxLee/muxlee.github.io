import { InjectionToken, makeEnvironmentProviders, Provider } from '@angular/core';
import { environment } from '@environments/environment';

type Constructor<T> = {
    new (...args: any[]): T;
};

interface ServiceOption<T> {

    environment: string;

    token: T | Function | InjectionToken<T>;

    useClass: Constructor<T>;

    deps?: any[];

}

const environmentProvider: Map<string, Provider[]> = new Map();

function registerService<T>(option: ServiceOption<T>) {
    const providers = environmentProvider.get(option.environment) || [];
    const dependencies = option.deps || [];
    const provider: Provider = {
        provide: option.token,
        useClass: option.useClass,
        deps: dependencies
    };

    providers.push(provider);
    environmentProvider.set(option.environment, providers);
}

function provideService()  {
    const providers = environmentProvider.get(environment.mode) || [];

    return makeEnvironmentProviders(providers);
}

export {
    registerService,
    provideService
}
