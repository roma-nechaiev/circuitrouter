import { Handler } from "./Router.js";

export type Where = RegExp | string[] | ((param: string) => boolean);

class Route {
    methods: string[];
    uri: string;
    action: Handler;
    middlewares: Handler[] = [];
    wheres: Record<string, Where> = {};

    constructor(methods: string[], uri: string, action: Handler) {
        this.methods = methods;
        this.uri = this.normalizeUri(uri);
        this.action = action;
    }

    middleware(...handlers: Handler[]): this {
        for (const handler of handlers) {
            if (typeof handler !== 'function') {
                throw new TypeError('Middleware must be a function');
            }
            this.middlewares.push(handler);
        }
        return this;
    }

    where(param: string | Record<string, Where>, pattern?: Where): this {
        if (typeof param === 'string' && pattern) {
            this.wheres[param] = this.validateConditionType(pattern);
        } else if (typeof param === 'object') {
            for (const key in param) {
                this.wheres[key] = this.validateConditionType(param[key]);
            }
        } else {
            throw new TypeError('Invalid parameters for where()');
        }

        return this;
    }

    private normalizeUri(uri: string): string {
        return `/${uri}`.replace(/\/+/g, '/').replace(/\/$/, '');
    }

    private validateConditionType(pattern: Where): Where {
        if (pattern instanceof RegExp || Array.isArray(pattern) || typeof pattern === 'function') {
            return pattern;
        }

        throw new TypeError('Pattern must be a RegExp, array or a function');
    }
}

export default Route;