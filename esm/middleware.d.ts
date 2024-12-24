import { IncomingMessage, ServerResponse } from "node:http";
/**
 * Handles 404 errors by sending a JSON response with status 404.
 *
 * @param req - The incoming HTTP request.
 * @param res - The outgoing HTTP response.
 * @returns A Promise that resolves when the response has been sent.
 */
declare function notFoundHandler(req: IncomingMessage, res: ServerResponse): Promise<void>;
/**
 * Handles errors by logging them and sending a JSON response with status 500.
 *
 * @param err - The error object to handle.
 * @param req - The incoming HTTP request.
 * @param res - The outgoing HTTP response.
 */
declare function errorHandler(err: Error, req: IncomingMessage, res: ServerResponse): Promise<void>;
export { notFoundHandler, errorHandler };
