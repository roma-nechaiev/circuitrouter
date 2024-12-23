import type Route from "./Route.js";
import type { Params } from "./Router.js";
export interface RouteNode {
    children: Map<string, RouteNode>;
    route?: Route;
}
declare class RoutesTree {
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
     * @param {string} method The HTTP method to match
     * @param {string} url The URL to match
     * @returns {{ route: Route; params: Params } | null} An object with the matched route and the parsed URL parameters, or null if no route is found
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
     * @param {RouteNode} node The current node in the routes tree
     * @param {string[]} parts The remaining parts of the url to match
     * @param {Params} params The parsed params so far
     * @returns {{ route: Route; params: Params } | null} An object with the route and the parsed params, or null if no route is found
     */
    private matchRoute;
    /**
     * Finds or creates a route node for the given HTTP method.
     * @param {string} method the HTTP method to find or create a route node for
     * @returns {RouteNode} the route node for the given HTTP method
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
     * @param {Route} route The route object containing the "wheres" conditions.
     * @param {Record<string, string>} params The parameters to validate against the route's conditions.
     * @returns {boolean} `true` if all conditions are satisfied, otherwise `boolean`
     */
    private validateWheres;
}
export default RoutesTree;
