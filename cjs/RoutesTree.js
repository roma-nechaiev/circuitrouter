"use strict";
/** @type {import('circuitrouter/cjs').RoutesTree} */
class RoutesTree {
    constructor() {
        this.root = { children: new Map() };
    }
    addRoute(route, methods) {
        for (const method of methods) {
            let node = this.findOrCreateMethodNode(method);
            const parts = route.uri.split('/').filter(Boolean);
            for (const part of parts) {
                if (!node.children.has(part)) {
                    node.children.set(part, { children: new Map() });
                }
                node = node.children.get(part);
            }
            if (node.route) {
                throw new Error(`Route already exists for ${method} ${route.uri}`);
            }
            node.route = route;
        }
    }
    findRoute(method, url) {
        const methodNode = this.root.children.get(method);
        if (!methodNode) {
            return null;
        }
        const parts = url.split('/').filter(Boolean);
        const params = {};
        return this.matchRoute(methodNode, parts, params);
    }
    matchRoute(node, parts, params) {
        if (parts.length === 0) {
            return node.route ? { route: node.route, params } : null;
        }
        const [part, ...rest] = parts;
        if (node.children.has(part)) {
            const exactMatch = this.matchRoute(node.children.get(part), rest, params);
            if (exactMatch) {
                return exactMatch;
            }
        }
        const paramNode = Array.from(node.children.entries()).find(([key]) => key.startsWith(':'));
        if (paramNode) {
            const [paramKey, paramValue] = paramNode;
            params[paramKey.slice(1)] = part;
            const paramMatch = this.matchRoute(paramValue, rest, params);
            if (paramMatch) {
                if (this.validateWheres(paramMatch.route, params)) {
                    return paramMatch;
                }
                return null;
            }
        }
        const wildcardNode = node.children.get('*');
        if (wildcardNode) {
            const remainingParams = { ...params };
            remainingParams['*'] = [part, ...rest].join('/');
            const wildcardMatch = this.matchRoute(wildcardNode, [], remainingParams);
            if (wildcardMatch) {
                return wildcardMatch;
            }
        }
        return null;
    }
    findOrCreateMethodNode(method) {
        if (!this.root.children.has(method)) {
            this.root.children.set(method, { children: new Map() });
        }
        return this.root.children.get(method);
    }
    validateWheres(route, params) {
        for (const [key, condition] of Object.entries(route.wheres)) {
            if (!(key in params))
                continue;
            const value = params[key];
            if (condition instanceof RegExp) {
                return condition.test(value);
            }
            if (Array.isArray(condition)) {
                return condition.includes(value);
            }
            if (typeof condition === 'function') {
                return condition(value);
            }
        }
        return true;
    }
}
module.exports = RoutesTree;
