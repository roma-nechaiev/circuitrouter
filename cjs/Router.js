"use strict";
const { METHODS } = require("node:http");
const RoutesTree = require("./RoutesTree.js");
const Route = require("./Route.js");
const { notFoundHandler, errorHandler } = require("./middleware.js");
/** @type {import('circuitrouter/cjs').Router} */
class Router {
    constructor(notFoundHandler, errorHandler) {
        this.middlewares = [];
        this.groupStack = [];
        this.tree = new RoutesTree;
        if (!notFoundHandler) {
            throw new Error('notFoundHandler is required');
        }
        if (!errorHandler) {
            throw new Error('errorHandler is required');
        }
        this.notFoundHandler = notFoundHandler;
        this.errorHandler = errorHandler;
    }
    get(uri, action) {
        return this.createRoute(['GET', 'HEAD'], uri, action);
    }
    post(uri, action) {
        return this.createRoute('POST', uri, action);
    }
    put(uri, action) {
        return this.createRoute('PUT', uri, action);
    }
    patch(uri, action) {
        return this.createRoute('PATCH', uri, action);
    }
    delete(uri, action) {
        return this.createRoute('DELETE', uri, action);
    }
    options(uri, action) {
        return this.createRoute('OPTIONS', uri, action);
    }
    any(uri, action) {
        return this.createRoute(METHODS, uri, action);
    }
    match(methods, uri, action) {
        if (!Array.isArray(methods)) {
            throw new TypeError('The methods parameter must be an array');
        }
        const upperMethods = methods.map((method) => {
            if (typeof method !== 'string') {
                throw new TypeError('The method should be a string.');
            }
            if (!METHODS.includes(method.toUpperCase())) {
                throw new TypeError(`Invalid HTTP method: ${method}`);
            }
            return method.toUpperCase();
        });
        if (upperMethods.includes('GET') && !upperMethods.includes('HEAD')) {
            upperMethods.push('HEAD');
        }
        return this.createRoute(upperMethods, uri, action);
    }
    method(method, uri, action) {
        if (typeof method !== 'string') {
            throw new TypeError('The method should be a string');
        }
        const upperMethod = method.toUpperCase();
        if (!METHODS.includes(upperMethod)) {
            throw new TypeError(`Invalid HTTP method: ${method}`);
        }
        if (upperMethod === 'GET') {
            return this.createRoute(['GET', 'HEAD'], uri, action);
        }
        return this.createRoute([method], uri, action);
    }
    group(prefix, routes) {
        this.groupStack.push(prefix);
        routes(this); // Allow the provided function to register routes with this group
        this.groupStack.pop();
    }
    middleware(...handlers) {
        handlers.forEach(handler => {
            if (typeof handler !== 'function') {
                throw new TypeError('argument handlers must be the array of functions');
            }
            this.middlewares.push(handler);
        });
        return this;
    }
    createRoute(methods, uri, action) {
        const methodsArray = Array.isArray(methods) ? methods : [methods];
        const uriWithPrefix = this.groupStack.length ? `${this.groupStack.join('/')}${uri}` : uri; // Apply prefix if in a group
        const route = new Route(methodsArray, uriWithPrefix, action);
        this.tree.addRoute(route, methodsArray);
        return route;
    }
    async onRequest(req, res) {
        try {
            if (!req.url || !req.method) {
                await this.notFoundHandler(req, res);
                return;
            }
            for (const middleware of this.middlewares) {
                await middleware(req, res);
            }
            const urlWithoutQueryParams = req.url.split('?')[0];
            const matchedRoute = this.tree.findRoute(req.method, urlWithoutQueryParams);
            if (!matchedRoute) {
                await this.notFoundHandler(req, res);
                return;
            }
            req.params = matchedRoute.params;
            for (const routeMiddleware of matchedRoute.route.middlewares) {
                await routeMiddleware(req, res);
            }
            await matchedRoute.route.action(req, res);
        }
        catch (err) {
            await this.errorHandler(err, req, res);
        }
    }
}
module.exports = { Router, notFoundHandler, errorHandler }; 
