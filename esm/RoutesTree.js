class RoutesTree {
    root = { children: new Map() };
    /**
     * Add a route to the tree.
     *
     * @param {Route} route - The route to add.
     * @param {string[]} methods - The methods to add the route for.
     * @throws {Error} if there is already a route registered for one of the methods.
     */
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
    /**
     * Find a route in the routes tree that matches the given HTTP method and URL.
     *
     * @param method The HTTP method to match
     * @param url The URL to match
     * @returns An object with the matched route and the parsed URL parameters, or null if no route is found
     */
    findRoute(method, url) {
        const methodNode = this.root.children.get(method);
        if (!methodNode) {
            return null;
        }
        const parts = url.split('/').filter(Boolean);
        const params = {};
        return this.matchRoute(methodNode, parts, params);
    }
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
    matchRoute(node, parts, params) {
        if (parts.length === 0) {
            return node.route ? { route: node.route, params } : null;
        }
        const [part, ...rest] = parts;
        // Match exact route part
        if (node.children.has(part)) {
            const exactMatch = this.matchRoute(node.children.get(part), rest, params);
            if (exactMatch) {
                return exactMatch;
            }
        }
        // Match parameterized route (:param)
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
        // Match wildcard route (*)
        const wildcardNode = node.children.get('*');
        if (wildcardNode) {
            const remainingParams = { ...params };
            remainingParams['*'] = [part, ...rest].join('/');
            const wildcardMatch = this.matchRoute(wildcardNode, [], remainingParams);
            if (wildcardMatch) {
                return wildcardMatch;
            }
        }
        return null; // No match
    }
    /**
     * Finds or creates a route node for the given HTTP method.
     * @param method the HTTP method to find or create a route node for
     * @returns the route node for the given HTTP method
     * @private
     */
    findOrCreateMethodNode(method) {
        if (!this.root.children.has(method)) {
            this.root.children.set(method, { children: new Map() });
        }
        return this.root.children.get(method);
    }
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
export default RoutesTree;
