import { Directive, OnDestroy, OnInit } from '@angular/core';
import { v7 } from 'uuid';

type Constructor = new (...args: any[]) => any;

interface Lazy {

    hooks: InstanceType<Constructor>[];
    
}

interface LazyDecorator {

    (options: Lazy): any;

    new (options: Lazy): any;

}

@Directive()
class LazyScriptHook implements OnDestroy, OnInit {

    #scriptElements: HTMLScriptElement[];
    #scriptUrlSet: Set<string>;

    constructor(scriptUrls: string[]) {
        this.#scriptElements = [];
        this.#scriptUrlSet = new Set(scriptUrls);
    }

    ngOnDestroy(): void {
        while (this.#scriptElements.length) {
            const scriptElement = this.#scriptElements.pop();

            if (scriptElement) {
                document.body.removeChild(scriptElement);
            }
        }
    }

    ngOnInit(): void {
        for (const scriptUrl of this.#scriptUrlSet) {
            const scriptElement = document.createElement('script');

            scriptElement.src = scriptUrl;

            this.#scriptElements.push(scriptElement);
            document.body.appendChild(scriptElement);
        }
    }

    static more(...scriptUrls: string[]) {
        return new LazyScriptHook(scriptUrls);
    }

    static once(scriptUrl: string) {
        return new LazyScriptHook([scriptUrl]);
    }

}

@Directive()
class LazyStyleHook implements OnDestroy, OnInit {

    #linkElements: HTMLLinkElement[];
    #styleUrlSet: Set<string>;

    constructor(styleUrls: string[]) {
        this.#linkElements = [];
        this.#styleUrlSet = new Set(styleUrls);
    }

    ngOnDestroy(): void {
        while (this.#linkElements.length) {
            const linkElement = this.#linkElements.pop();

            if (linkElement) {
                document.head.removeChild(linkElement);
            }
        }
    }

    ngOnInit() {
        for (const styleUrl of this.#styleUrlSet) {
            const linkElement = document.createElement('link');

            linkElement.dataset['identity'] = v7();
            linkElement.href = styleUrl;
            linkElement.rel = 'stylesheet';

            this.#linkElements.push(linkElement);
            document.head.appendChild(linkElement);
        }
    }

    static more(...styleUrls: string[]) {
        return new LazyStyleHook(styleUrls);
    }

    static once(styleUrl: string) {
        return new LazyStyleHook([styleUrl]);
    }

}

const Lazy: LazyDecorator = function(options: Lazy) {
    return function<T extends Constructor>(constructor: T) {
        const { hooks } = options;
        const propertyNames = Object.getOwnPropertyNames(constructor.prototype);

        for (const propertyName of propertyNames) {
            if (propertyName !== 'constructor') {
                for (const hook of hooks) {
                    const prototypeOf = Object.getPrototypeOf(hook);

                    if (propertyName in prototypeOf) {
                        const method: Function = constructor.prototype[propertyName];
                        const lazyMethod: Function = hook[propertyName];

                        constructor.prototype[propertyName] = function(this: typeof constructor.prototype, ...args: any[]) {
                            method.call(this, ...args);
                            lazyMethod.call(hook, ...args);
                        }
                    }
                }
            }
        }

        return constructor;
    }
} as LazyDecorator;

export {
    Lazy,
    LazyScriptHook,
    LazyStyleHook
};