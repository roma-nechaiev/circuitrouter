"use strict";
class Route {
    methods;
    uri;
    action;
    middlewares = [];
    wheres = {};
    constructor(methods, uri, action) {
        this.methods = methods;
        this.uri = this.normalizeUri(uri);
        this.action = action;
    }
    middleware(...handlers) {
        for (const handler of handlers) {
            if (typeof handler !== 'function') {
                throw new TypeError('Middleware must be a function');
            }
            this.middlewares.push(handler);
        }
        return this;
    }
    where(param, pattern) {
        if (typeof param === 'string' && pattern) {
            this.wheres[param] = this.validateConditionType(pattern);
        }
        else if (typeof param === 'object') {
            for (const key in param) {
                this.wheres[key] = this.validateConditionType(param[key]);
            }
        }
        else {
            throw new TypeError('Invalid parameters for where()');
        }
        return this;
    }
    normalizeUri(uri) {
        return `/${uri}`.replace(/\/+/g, '/').replace(/\/$/, '');
    }
    validateConditionType(pattern) {
        if (pattern instanceof RegExp || Array.isArray(pattern) || typeof pattern === 'function') {
            return pattern;
        }
        throw new TypeError('Pattern must be a RegExp, array or a function');
    }
}
module.exports = Route;

