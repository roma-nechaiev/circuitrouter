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
export declare class Router {
    middlewares: Handler[];
    groupStack: string[];
    tree: RoutesTree;
    get(uri: string, action: Handler): Route;
    post(uri: string, action: Handler): Route;
    put(uri: string, action: Handler): Route;
    patch(uri: string, action: Handler): Route;
    delete(uri: string, action: Handler): Route;
    options(uri: string, action: Handler): Route;
    any(uri: string, action: Handler): Route;
    match(methods: string[], uri: string, action: Handler): Route;
    method(method: string, uri: string, action: Handler): Route;
    group(prefix: string, routes: (router: Router) => void): void;
    middleware(...handlers: Handler[]): this;
    private createRoute;
    onRequest: Handler;
    notFoundHandler: Handler;
    errorHandler: ErrorHandler;
} 
export declare class Route {
    methods: string[];
    uri: string;
    action: Handler;
    middlewares: Handler[];
    wheres: Record<string, Where>;
    constructor(methods: string[], uri: string, action: Handler);
    middleware(...handlers: Handler[]): this;
    where(param: string | Record<string, Where>, pattern?: Where): this;
    private normalizeUri;
    private validateConditionType;
}
export declare class RoutesTree {
    root: RouteNode;
    /**
     * Add a route to the tree.
     *
     * @param {Route} route - The route to add.
     * @param {string[]} methods - The methods to add the route for.
     * @throws {Error} if there is already a route registered for one of the methods.
     */
    addRoute(route: Route, methods: string[]): void;
    /**
     * Find a route in the routes tree that matches the given HTTP method and URL.
     *
     * @param method The HTTP method to match
     * @param url The URL to match
     * @returns An object with the matched route and the parsed URL parameters, or null if no route is found
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
     * @returns `boolean`
     */
    private validateWheres;
}