# Lab 3 REST API

## How to Run

```bash
npm install
npm run server
```

The server runs on:

```text
http://localhost:3000
```

## How to Test

```bash
npm test
```

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/items` | Return all items |
| GET | `/items/:id` | Return one item |
| POST | `/items` | Create one item |
| PUT | `/items/:id` | Update one item |
| DELETE | `/items/:id` | Delete one item |

## Reflection Answers

### 1. What makes this API more REST-like than the previous HTTP/JSON lab?

Lab 2 used verbs like *calculate* and *echo* for some of the URI's, in contrast with the RESTful structure of Lab 3 where the URI only ever ends in nouns (items, item/:id). Any 'verb' that acts upon these nouns are sent via a `curl` request, in which one of the four CRUD actions is taken.

### 2. What is the purpose of a route parameter such as `/items/:id`?

As a parameter, `:id` allows the user to put any `id` in the URI, and the server will process the request using the same code. Without the parameterizing syntax, every `id` would need to be hard coded in the server's program:

```js
app.get("/items/1", ...)
app.get("/items/2", ...)
app.get("/items/3", ...)
...
```

Old answer:

~~In general, route parameters allow the 'noun' portion of the API request to be visible to the user via the URI. The 'verb' action described in the previous answer should occur behind the scenes. This applies to queries too (JSON request bodies) such that specific state changes are also hidden from the user, with the exception of the question mark `?query=` syntax.~~

~~As for the `id` parameter, this allows specific instances of items to be treated as nouns just like the abstract `items` noun is. This is similar to classes vs. objects in object-oriented programming.~~

### 3. Why should `POST`, `PUT`, and `DELETE` use different HTTP methods?

The question might have meant to ask "Why are these three separate HTTP methods?" because they *are* HTTP methods; they don't "use" HTTP methods.

POST and PUT are separate because of the convenience PUT allows the developer when updating existing data. If a user has a data profile with thousands of entries, and one of those entries needs to be updated, PUT allows the client to send a single entry change for the server to act on. Without PUT, then POST would be the only way to apply changes to data (other than DELETE), and so each time 1 entry needs to be updated, the entire table of thousands of data entries would need to be re-sent, even though almost all entries remain the same.

DELETE is needed for convenience and safety. Without it, again POST or PUT would be required. Would the rule be that if a user sends an empty POST request, then all of their data is deleted? That may work, but it is risky. If the clientside code is poorly programmed, or if a terminal-savvy user is playing with curl, they may accidentally delete their data with an innocent-looking POST request. So, DELETE is a very clear way to differentiate intentions.

### 4. What is the difference between a `400` error and a `404` error?

400 errors indicate a malformed request on the part of the client, e.g. malformed JSON, incorrect types, or missing fields.

404 errors indicate that, while the client's request may have been valid, the data the client intends to retrieve or update does not exist.

### 5. How does the OpenAPI file relate to your Express server code?

While it isn't easily readable on its own, the OpenAPI VS Code extension lets me see the API endpoints for my server, even color coding the HTTP request types. It acts as a guideline for what format the rest of my program needs to follow; "fill the obligations of the API guide and do no more."

The extension also lets me submit requests, exposing a second avenue through which to test program behavior (other than terminal, browser, or vitest).

## Graduate Extension

- The server.js function `itemHasValidNameAndQuantity` exists to check both the types of the `name` and `quantity` entries in the JSON request body, as well as ensuring `name` has at least 1 character and `quantity` is greater than or equal to zero.

  - This function is used anywhere that a JSON request is sent, such as in the `POST` and `PUT` requests.

  - With this validation function, invalid `POST` and `PUT` requests are rejected with a 400 status code.

  - All 400 level status codes (400, 404) are sent to the user alongside an error response body that briefly reports the reason for the rejection.

- `server.test.js` tests all rejections, including the ones described in the graduate extension above.
