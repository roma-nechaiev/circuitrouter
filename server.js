const { createServer } = require('http');

const { Router, notFoundHandler, errorHandler } = require('./cjs/Router.js');
const router = new Router(
    notFoundHandler,
    errorHandler
);

router.get('/', (req, res) => {
    res.end('Hello World');
});


const server = createServer((req, res) => {
    router.handle(req, res);
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});