import { Handler } from "./Router.js";
export type Where = RegExp | string[] | ((param: string) => boolean);
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
export default Route;
