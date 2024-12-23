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


declare class Route {
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

declare class RoutesTree {
    root: RouteNode;
    addRoute(route: Route, methods: string[]): void;
    findRoute(method: string, url: string): {
        route: Route;
        params: Params;
    } | null;
    private matchRoute;
    private findOrCreateMethodNode;
    private validateWheres;
}

declare class Router {
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

declare module "circuitrouter/cjs" {
    export = Router;
}