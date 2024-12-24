const { STATUS_CODES } = require("node:http");
async function notFoundHandler(req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({
        status: 404,
        message: STATUS_CODES[404]
    }));
    res.end();
}
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
module.exports = { notFoundHandler, errorHandler }; 