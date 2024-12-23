import { Handler } from "./Router.js";
export type Where = RegExp | string[] | ((param: string) => boolean);
declare class Route {
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
export default Route;
