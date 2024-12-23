import type { IncomingMessage, ServerResponse } from "node:http";
export type Handler = (req: IncomingMessage & {
    params: Params;
}, res: ServerResponse) => void | Promise<void>;
export type Params = Record<string, string>;
export type ErrorHandler = (err: Error, req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
export type Where = RegExp | string[] | ((param: string) => boolean);
export interface RouteNode {
    children: Map<string, RouteNode>;
    route?: Route;
}

export class Route {
    methods: string[];
    uri: string;
    action: Handler;
    middlewares: Handler[];
    wheres: Record<string, Where>;
    /**
     * Constructs a new Route instance.
     *
     * @param methods - An array of HTTP methods (e.g., 'GET', 'POST') associated with this route.
     * @param uri - The URI pattern for this route.
     * @param action - The handler function to be executed when the route is matched.
     */
    constructor(methods: string[], uri: string, action: Handler);
    /**
     * Adds one or more middleware functions to the route.
     *
     * @param handlers - The middleware functions to be added. Each handler must be a function.
     * @returns The current Route instance for chaining.
     * @throws If any of the provided handlers is not a function.
     */
    middleware(...handlers: Handler[]): this;
    /**
     * Adds a condition to the route that must be satisfied by the
     * corresponding URL parameter.
     *
     * @param param The parameter to validate.
     *   If a string, it is the name of the parameter to validate.
     *   If an object, it is a mapping from parameter names to patterns.
     * @param pattern The pattern to validate the parameter against.
     *   If not provided, the object passed as the first argument must be an
     *   object with parameter names as keys and patterns as values.
     * @returns The current Route instance for chaining.
     * @throws If the parameters are invalid.
     */
    where(param: string | Record<string, Where>, pattern?: Where): this;
    /**
     * Normalizes the URI by removing trailing slashes and collapsing
     * consecutive slashes into a single slash.
     *
     * @param uri - The URI to normalize
     * @returns The normalized URI
     * @private
     */
    private normalizeUri;
    /**
     * Validates the condition type by ensuring it is a valid pattern
     * that can be used to validate route parameters.
     *
     * @param pattern The pattern to validate
     * @returns The validated pattern
     * @throws If the pattern is invalid
     * @private
     */
    private validateConditionType;
}

export class RoutesTree {
    root: RouteNode;
    /**
     * Add a route to the tree.
     *
     * @param route - The route to add.
     * @param methods - The methods to add the route for.
     * @throws if there is already a route registered for one of the methods.
     */
    addRoute(route: Route, methods: string[]): void;
    /**
     * Find a route in the routes tree that matches the given HTTP method and URL.
     *
     * @param method The HTTP method to match
     * @param url The URL to match
     * @returns  An object with the matched route and the parsed URL parameters, or null if no route is found
     */
    findRoute(method: string, url: string): {
        route: Route;
        params: Params;
    } | null;
    /**
     * Recursively traverse the routes tree to find a matching route for the given method and url.
     * If a route is found, returns an object with the route and the parsed params.
     * If no route is found, returns null.
     *
     * @param node The current node in the routes tree
     * @param parts The remaining parts of the url to match
     * @param params The parsed params so far
     * @returns An object with the route and the parsed params, or null if no route is found
     */
    private matchRoute;
    /**
     * Finds or creates a route node for the given HTTP method.
     * @param method the HTTP method to find or create a route node for
     * @returns the route node for the given HTTP method
     * @private
     */
    private findOrCreateMethodNode;
    /**
     * Validates the parameters against the conditions specified in the route's "wheres".
     *
     * Iterates over each condition defined in the route's "wheres" and checks if the
     * corresponding parameter in the params object satisfies that condition. Conditions
     * can be a regular expression, an array of allowed values, or a custom validation
     * function.
     *
     * @param route The route object containing the "wheres" conditions.
     * @param params The parameters to validate against the route's conditions.
     * @returns `true` if all conditions are satisfied, otherwise `boolean`
     */
    private validateWheres;
}

export class Router {
    middlewares: Handler[];
    groupStack: string[];
    tree: RoutesTree;
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
    onRequest: Handler;
    notFoundHandler: Handler;
    errorHandler: ErrorHandler;
}

declare module "circuitrouter/cjs" {
    export = Router;
}