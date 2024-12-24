import { STATUS_CODES } from "node:http";
/**
 * Handles 404 errors by sending a JSON response with status 404.
 *
 * @param req - The incoming HTTP request.
 * @param res - The outgoing HTTP response.
 * @returns A Promise that resolves when the response has been sent.
 */
async function notFoundHandler(req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
        status: 404,
        message: STATUS_CODES[404]
    }));
    res.end();
}
/**
 * Handles errors by logging them and sending a JSON response with status 500.
 *
 * @param err - The error object to handle.
 * @param req - The incoming HTTP request.
 * @param res - The outgoing HTTP response.
 */
async function errorHandler(err, req, res) {
    console.error(err); // Default: log the error
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
        status: 500,
        message: STATUS_CODES[500],
        error: err.message
    }));
    res.end();
}
;
export { notFoundHandler, errorHandler };
