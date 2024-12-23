import type { IncomingMessage, ServerResponse } from "node:http";
import RoutesTree from "./RoutesTree.js";
import Route from "./Route.js";
export type Handler = (req: IncomingMessage & {
    params: Params;
}, res: ServerResponse) => void | Promise<void>;
export type Params = Record<string, string>;
export type ErrorHandler = (err: Error, req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
declare class Router {
    middlewares: Handler[];
    groupStack: string[];
    tree: RoutesTree;
    /**
     * Registers a route handler for GET and HEAD requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    get(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for POST requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    post(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for PUT requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    put(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for PATCH requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    patch(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for DELETE requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    delete(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for OPTIONS requests to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    options(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for all HTTP methods to a specified URI.
     *
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    any(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for any of the specified HTTP methods to a specified URI.
     *
     * @param {string[]} methods - An array of HTTP methods (e.g., 'GET', 'POST') associated with this route.
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    match(methods: string[], uri: string, action: Handler): Route;
    /**
     * Registers a route handler for the specified HTTP method to a specified URI.
     *
     * @param {string} method - The HTTP method to associate with this route (e.g., 'GET', 'POST').
     * @param {string} uri - The URI pattern to match for the route.
     * @param {Handler} action - The handler function to execute when the route is matched.
     * @returns {Route} The created route instance.
     */
    method(method: string, uri: string, action: Handler): Route;
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
    group(prefix: string, routes: (router: Router) => void): void;
    /**
     * Registers one or more middleware functions to be executed by the router.
     *
     * @param {...Handler[]} handlers - One or more middleware functions to register.
     * @returns {this} The Router instance to support method chaining.
     * @throws {TypeError} If any of the provided handlers is not a function.
     */
    middleware(...handlers: Handler[]): this;
    /**
     * Creates and registers a new route with the specified HTTP methods, URI, and action.
     *
     * @param {string | string[]} methods - The HTTP method(s) to associate with the route (e.g., 'GET', 'POST').
     * @param {string} uri - The URI pattern for the route.
     * @param {Handler} action - The handler function to be executed when the route is matched.
     * @returns {Route} The newly created Route instance.
     * @private
     */
    private createRoute;
    onRequest: Handler;
    notFoundHandler: Handler;
    errorHandler: ErrorHandler;
}
export default Router;
