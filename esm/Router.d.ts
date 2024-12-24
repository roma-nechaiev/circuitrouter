import type { IncomingMessage, ServerResponse } from "node:http";
import RoutesTree from "./RoutesTree.js";
import Route from "./Route.js";
import { notFoundHandler, errorHandler } from "./middleware.js";
export type Handler = (req: IncomingMessage & {
    params: Params;
}, res: ServerResponse) => void | Promise<void>;
export type Params = Record<string, string>;
export type ErrorHandler = (err: Error, req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
declare class Router {
    middlewares: Handler[];
    groupStack: string[];
    tree: RoutesTree;
    notFoundHandler: Handler;
    errorHandler: ErrorHandler;
    constructor(notFoundHandler: Handler, errorHandler: ErrorHandler);
    /**
     * Registers a route handler for GET and HEAD requests to a specified URI.
     *
     * @param uri - The URI pattern to match for the route.
     * @param action - The handler function to execute when the route is matched.
     * @returns The created route instance.
     */
    get(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for POST requests to a specified URI.
     *
     * @param uri - The URI pattern to match for the route.
     * @param action - The handler function to execute when the route is matched.
     * @returns The created route instance.
     */
    post(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for PUT requests to a specified URI.
     *
     * @param uri - The URI pattern to match for the route.
     * @param action - The handler function to execute when the route is matched.
     * @returns The created route instance.
     */
    put(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for PATCH requests to a specified URI.
     *
     * @param uri - The URI pattern to match for the route.
     * @param action - The handler function to execute when the route is matched.
     * @returns The created route instance.
     */
    patch(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for DELETE requests to a specified URI.
     *
     * @param uri - The URI pattern to match for the route.
     * @param action - The handler function to execute when the route is matched.
     * @returns The created route instance.
     */
    delete(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for OPTIONS requests to a specified URI.
     *
     * @param uri - The URI pattern to match for the route.
     * @param action - The handler function to execute when the route is matched.
     * @returns The created route instance.
     */
    options(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for all HTTP methods to a specified URI.
     *
     * @param uri - The URI pattern to match for the route.
     * @param action - The handler function to execute when the route is matched.
     * @returns The created route instance.
     */
    any(uri: string, action: Handler): Route;
    /**
     * Registers a route handler for any of the specified HTTP methods to a specified URI.
     *
     * @param methods - An array of HTTP methods (e.g., 'GET', 'POST') associated with this route.
     * @param uri - The URI pattern to match for the route.
     * @param action - The handler function to execute when the route is matched.
     * @returns The created route instance.
     */
    match(methods: string[], uri: string, action: Handler): Route;
    /**
     * Registers a route handler for the specified HTTP method to a specified URI.
     *
     * @param method - The HTTP method to associate with this route (e.g., 'GET', 'POST').
     * @param uri - The URI pattern to match for the route.
     * @param action - The handler function to execute when the route is matched.
     * @returns The created route instance.
     */
    method(method: string, uri: string, action: Handler): Route;
    /**
     * Groups a set of route handlers under a common URI prefix.
     *
     * @param prefix - The URI prefix to apply to all routes registered
     * within the provided callback.
     * @param routes - The callback to execute when
     * grouping routes. The Router instance is passed as an argument to the
     * callback.
     * @returns The Router instance to support method chaining.
     */
    group(prefix: string, routes: (router: Router) => void): void;
    /**
     * Registers one or more middleware functions to be executed by the router.
     *
     * @param handlers - One or more middleware functions to register.
     * @returns The Router instance to support method chaining.
     * @throws If any of the provided handlers is not a function.
     */
    middleware(...handlers: Handler[]): this;
    /**
     * Creates and registers a new route with the specified HTTP methods, URI, and action.
     *
     * @param methods - The HTTP method(s) to associate with the route (e.g., 'GET', 'POST').
     * @param uri - The URI pattern for the route.
     * @param action - The handler function to be executed when the route is matched.
     * @returns The newly created Route instance.
     * @private
     */
    private createRoute;
    onRequest(req: IncomingMessage & {
        params: Params;
    }, res: ServerResponse): Promise<void>;
}
export { Router, notFoundHandler, errorHandler };
export default Router;
