# Project Overview

This is a Node.js Express API project designed to demonstrate Swagger functionality. It provides a set of RESTful endpoints for managing a list of "items" and "users" in memory. The API documentation is served using Swagger UI.

**Key Technologies:**
*   Node.js
*   Express (web framework)
*   Swagger-UI-Express (serves Swagger UI)
*   Swagger-JSDoc (integrates Swagger definitions)

# Building and Running

## Installation

To install the project dependencies, run:

```bash
npm install
```

## Running the Application

To start the API server, execute:

```bash
node index.js
```

The server will start on `http://localhost:3000`.

## API Documentation

Once the server is running, you can access the interactive API documentation (Swagger UI) at:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

# Development Conventions

*   **API Definition:** The API endpoints and models are defined in `swagger.json` following the OpenAPI 3.0.0 specification.
*   **In-memory Data:** Data for items and users is stored in-memory and will be reset each time the server restarts. This project is for demonstration purposes and does not use a persistent database.
*   **Error Handling:** Basic error handling is implemented for missing request body fields or unfound items.
