import type { IncomingMessage, ServerResponse } from "node:http";
import RoutesTree from "./RoutesTree.js";
import Route from "./Route.js";
export type Handler = (req: IncomingMessage & {
    params: Params;
}, res: ServerResponse) => void | Promise<void>;
export type Params = Record<string, string>;
type ErrorHandler = (err: Error, req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
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
export default Router;
