import { METHODS, STATUS_CODES } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import RoutesTree from "./RoutesTree.js";
import Route from "./Route.js";

export type Handler = (req: IncomingMessage & { params: Params }, res: ServerResponse) => void | Promise<void>;
export type Params = Record<string, string>;
type ErrorHandler = (err: Error, req: IncomingMessage, res: ServerResponse) => void | Promise<void>;

class Router {
    middlewares: Handler[] = [];
    groupStack: string[] = [];
    tree: RoutesTree = new RoutesTree;

    get(uri: string, action: Handler) {
        return this.createRoute(['GET', 'HEAD'], uri, action);
    }

    post(uri: string, action: Handler) {
        return this.createRoute('POST', uri, action);
    }

    put(uri: string, action: Handler) {
        return this.createRoute('PUT', uri, action);
    }

    patch(uri: string, action: Handler) {
        return this.createRoute('PATCH', uri, action);
    }

    delete(uri: string, action: Handler) {
        return this.createRoute('DELETE', uri, action);
    }

    options(uri: string, action: Handler) {
        return this.createRoute('OPTIONS', uri, action);
    }

    any(uri: string, action: Handler) {
        return this.createRoute(METHODS, uri, action);
    }

    match(methods: string[], uri: string, action: Handler) {
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

    method(method: string, uri: string, action: Handler) {
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

    group(prefix: string, routes: (router: Router) => void) {
        this.groupStack.push(prefix);
        routes(this); // Allow the provided function to register routes with this group
        this.groupStack.pop();
    }

    middleware(...handlers: Handler[]) {
        handlers.forEach(handler => {
            if (typeof handler !== 'function') {
                throw new TypeError('argument handlers must be the array of functions');
            }

            this.middlewares.push(handler);
        });

        return this;
    }

    private createRoute(methods: string | string[], uri: string, action: Handler): Route {
        const methodsArray = Array.isArray(methods) ? methods : [methods];
        const uriWithPrefix = this.groupStack.length ? `${this.groupStack.join('/')}${uri}` : uri; // Apply prefix if in a group
        const route = new Route(methodsArray, uriWithPrefix, action);

        this.tree.addRoute(route, methodsArray);

        return route;
    }

    onRequest: Handler = async (req, res) => {
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
        } catch (err) {
            await this.errorHandler(err as Error, req, res);
        }
    }

    notFoundHandler: Handler = async (req, res) => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({
            status: 404,
            message: STATUS_CODES[404]
        }));
        res.end();
    };

    errorHandler: ErrorHandler = async (err, req, res) => {
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

export default Router; 