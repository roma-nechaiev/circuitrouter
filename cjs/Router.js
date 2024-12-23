"use strict";
const { METHODS, STATUS_CODES } = require("node:http");
const RoutesTree = require("./RoutesTree.js");
const Route = require("./Route.js");
class Router {
    constructor() {
        this.middlewares = [];
        this.groupStack = [];
        this.tree = new RoutesTree;
        this.onRequest = async (req, res) => {
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
        };
        this.notFoundHandler = async (req, res) => {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify({
                status: 404,
                message: STATUS_CODES[404]
            }));
            res.end();
        };
        this.errorHandler = async (err, req, res) => {
            console.error(err); // Default: log the error
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify({
                status: 500,
                message: STATUS_CODES[500],
                error: err.message
            }));
            res.end();
        };
    }
    /**
     * Registers a route handler for GET and HEAD requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    get(uri, action) {
        return this.createRoute(['GET', 'HEAD'], uri, action);
    }
    /**
     * Registers a route handler for POST requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    post(uri, action) {
        return this.createRoute('POST', uri, action);
    }
    /**
     * Registers a route handler for PUT requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    put(uri, action) {
        return this.createRoute('PUT', uri, action);
    }
    /**
     * Registers a route handler for PATCH requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    patch(uri, action) {
        return this.createRoute('PATCH', uri, action);
    }
    /**
     * Registers a route handler for DELETE requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    delete(uri, action) {
        return this.createRoute('DELETE', uri, action);
    }
    /**
     * Registers a route handler for OPTIONS requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    options(uri, action) {
        return this.createRoute('OPTIONS', uri, action);
    }
    /**
     * Registers a route handler for all HTTP methods to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    any(uri, action) {
        return this.createRoute(METHODS, uri, action);
    }
    /**
     * Registers a route handler for any of the specified HTTP methods to a specified URI.
     *
     * @param {string[]} methods - An array of HTTP methods (e.g., 'GET', 'POST') associated with this route.
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
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
    /**
     * Registers a route handler for the specified HTTP method to a specified URI.
     *
     * @param {string} method - The HTTP method to associate with this route (e.g., 'GET', 'POST').
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
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
    /**
     * Groups a set of route handlers under a common URI prefix.
     *
     * @param {string} prefix - The URI prefix to apply to all routes registered
     * within the provided callback.
     * @param {(router: Router) => void} routes - The callback to execute when
     * grouping routes. The Router instance is passed as an argument to the
     * callback.
     * @returns {this} The Router instance to support method chaining.
     */
    group(prefix, routes) {
        this.groupStack.push(prefix);
        routes(this); // Allow the provided function to register routes with this group
        this.groupStack.pop();
    }
    /**
     * Registers one or more middleware functions to be executed by the router.
     *
     * @param {...Handler[]} handlers - One or more middleware functions to register.
     * @returns {this} The Router instance to support method chaining.
     * @throws {TypeError} If any of the provided handlers is not a function.
     */
    middleware(...handlers) {
        handlers.forEach(handler => {
            if (typeof handler !== 'function') {
                throw new TypeError('argument handlers must be the array of functions');
            }
            this.middlewares.push(handler);
        });
        return this;
    }
    /**
     * Creates and registers a new route with the specified HTTP methods, URI, and action.
     *
     * @param {string | string[]} methods - The HTTP method(s) to associate with the route (e.g., 'GET', 'POST').
     * @param {string} uri - The URI pattern for the route.
     * @param {Handler} action - The handler function to be executed when the route is matched.
     * @returns {Route} The newly created Route instance.
     * @private
     */
    createRoute(methods, uri, action) {
        const methodsArray = Array.isArray(methods) ? methods : [methods];
        const uriWithPrefix = this.groupStack.length ? `${this.groupStack.join('/')}${uri}` : uri; // Apply prefix if in a group
        const route = new Route(methodsArray, uriWithPrefix, action);
        this.tree.addRoute(route, methodsArray);
        return route;
    }
}
module.exports = Router;
