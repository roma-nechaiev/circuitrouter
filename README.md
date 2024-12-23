# Circuit Router

A simple and efficient router for Node.js that uses a modern approach to route handling. The package utilizes a `Map`-based tree, ensuring high performance and flexibility, allowing precise and fast route matching with easy management.

## Why Choose This Package?

- **Improved Performance**: The router uses a tree structure for route matching, ensuring quick and efficient lookups without relying on regular expressions. This approach is much faster, especially when dealing with a large number of routes, making the routing process highly efficient.

  **Advantages of the underlying structure**:

  - **Fast Lookup**: The use of a `Map` ensures that route lookups are done in constant time, which significantly improves performance over traditional methods.
  - **Scalability**: This structure handles increasing numbers of routes efficiently, maintaining fast response times even as your application grows.
  - **Flexibility**: The tree-based structure can adapt to complex routing needs, allowing precise and fast route matching.

- **Modern JavaScript and TypeScript**: Built with the latest features of JavaScript (ES6+), ensuring clean, modular, and efficient code. Fully written in TypeScript, it offers robust static typing, reducing runtime errors and improving developer productivity. This modern foundation ensures compatibility with contemporary development tools and practices.
- **Promise-Based**: Unlike Express and other routers, this one is fully built on promises, making asynchronous operations more natural and convenient.
- **Reliable Error Handling**: Built-in mechanisms efficiently handle errors, including 404 (Route Not Found) and 500 (Internal Server Error).
- **Flexible Parameter Validation**: The `where` method allows you to validate route parameters using regular expressions, lists of allowed values, or custom functions that return a boolean. This makes parameter handling convenient and adaptable to various needs.
- **Middleware at All Levels**: Allows adding middleware globally or at the route level.
- **Wildcard Route Support**: Supports wildcard routes using `*`, allowing for flexible matching of routes that can capture any remaining path, useful for dynamic or fallback routing.

This package is an excellent choice for developers who need a fast, clear, and modern solution for managing routing in server-side applications.

## Installation

```bash
npm install circuitrouter
```

## Usage

## Basic Setup

Depending on your project setup, you can use **CircuitRouter** with either **CommonJS** or **ESM**. Update your `package.json` accordingly:

- For CommonJS: `"type": "commonjs"`
- For ESM: `"type": "module"`

#### Example:

```javascript
// Import modules
const http = require('node:http'); // CommonJS
// import http from "node:http"; // Uncomment for ESM
const Router = require('circuitrouter/cjs'); // CommonJS
// import Router from "circuitrouter/esm"; // Uncomment for ESM

const router = new Router();

// Define routes
router.get('/hello', (req, res) => res.end('Hello, World!'));
router.post('/data', (req, res) => res.end('Data received'));

// Match all HTTP methods for a route.
router.any('/all-methods', (req, res) => {
  res.end(`Matched method: ${req.method}`);
});

// Match specific HTTP methods for a route.
router.match(['post', 'put'], '/update', (req, res) => {
  res.end(`You made a ${req.method} request.`);
});

// Define a route for a single custom HTTP method.
router.method('report', '/report', (req, res) => {
  res.end('Custom REPORT method handled.');
});

// Create the server
const server = http.createServer(router.onRequest);
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

## CircuitRouter Integration with Express

You can use **CircuitRouter** with **Express** by passing the router's request handler into Express's `app.use()` method.

### Example: Using CircuitRouter with Express

```javascript
import express from 'express';
import Router from 'circuitrouter';

const app = express();
const router = new Router();

// Define routes using the router
router.get('/hello', (req, res) => res.send('Hello, World!'));
router.post('/data', (req, res) => res.send('Data received'));

// Use the router with Express using app.use()
app.use(router.onRequest); // Pass router's onRequest handler

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### Route Parameters

```javascript
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  res.end(`User ID: ${userId}`);
});

// Add validation for parameters
router
  .get('/product/:id', (req, res) => {
    res.end(`Product ID: ${req.params.id}`);
  })
  .where('id', /^[0-9]+$/); // Only allow numeric IDs

// Array of allowed values
router
  .get('/status/:level', (req, res) => {
    res.end(`Status level: ${req.params.level}`);
  })
  .where('level', ['low', 'medium', 'high']); // Only "low", "medium", and "high" are allowed

// Custom function for validation
router
  .get('/user/:age', (req, res) => {
    res.end(`User age: ${req.params.age}`);
  })
  .where('age', (value) => parseInt(value) >= 18); // Only ages greater than 18 are allowed
```

### Wildcard Routes

```javascript
router.get('/files/*', async (req, res) => {
  res.end(`File path: ${req.params[0]}`);
});
```

### Middleware

```javascript
// Global middleware
router.middleware(async (req, res) => {
  console.log(`${req.method} ${req.url}`);
});

// Route-specific middleware
router
  .get('/protected', async (req, res) => {
    res.end('Welcome to the protected route');
  })
  .middleware(async (req, res) => {
    if (!req.headers.authorization) {
      res.statusCode = 401;
      res.end('Unauthorized');
      throw new Error('Unauthorized access');
    }
  });

// Multiple middlewares for a single route
router
  .get('/multiple-middleware', async (req, res) => {
    res.end('Multiple middleware executed');
  })
  .middleware(
    async (req, res) => {
      console.log('First middleware');
    },
    async (req, res) => {
      console.log('Second middleware');
    },
  );
```

### Grouping Routes

```javascript
router.group('/api/v1', (route) => {
  route.get('/users', async (req, res) => {
    res.end('User list');
  });

  route.post('/users', async (req, res) => {
    res.end('User created');
  });
});
```

### Error Handling

```javascript
router.errorHandler = async (err, req, res) => {
  console.error('Error:', err.message);
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      status: 500,
      error: err.message,
    }),
  );
};
```

### 404 Handling

```javascript
router.notFoundHandler = async (req, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      status: 404,
      message: 'Route not found',
    }),
  );
  res.end();
};
```

## API Reference

### `Router`

#### Methods:

- **`get(uri, action)`**: Define a `GET` route.
- **`post(uri, action)`**: Define a `POST` route.
- **`put(uri, action)`**: Define a `PUT` route.
- **`patch(uri, action)`**: Define a `PATCH` route.
- **`delete(uri, action)`**: Define a `DELETE` route.
- **`options(uri, action)`**: Define an `OPTIONS` route.
- **`any(uri, action)`**: Match all HTTP methods.
- **`match(methods, uri, action)`**: Match specific HTTP methods.
- **`method(method, uri, action)`**: Define a route for a single method.
- **`middleware(...handlers)`**: Add global middleware.
- **`group(prefix, routes)`**: Define a group of routes with a common prefix.

### `Route`

#### Methods:

- **`middleware(...handlers)`**: Add middleware to a specific route.
- **`where(param, condition | { param: condition } )`**: Add validation for route parameters.

## License

This package is open-source and available under the [MIT License](LICENSE).

---

Contributions, issues, and feature requests are welcome! Feel free to open an issue or create a pull request.
