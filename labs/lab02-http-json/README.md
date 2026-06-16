# Lab 2 - Hello HTTP + JSON

## Protocol

### `GET /health`

Returns a JSON response showing that the server is running.

Example response:

```json
{
  "status": "ok"
}
```

### `POST /echo`

Accepts a JSON request body and returns the same data back to the client.

Example request body:

```json
{
  "message": "hello"
}
```

Example response:

```json
{
  "message": "hello"
}
```

### `POST /uppercase`

An added route as part of the **Graduate Extension.** Identical to `/echo`, but makes the value of the `"message": "text"` key/value pair in the JSON response body uppercase.

Example request body:

```json
{
  "message": "hello"
}
```

Example response:

```json
{
  "message": "HELLO"
}
```

### `POST /calculate`

Accepts a JSON request body with an operation and two numbers.

Supports the following operations:

| Operation  | Meaning               |
| ---------- | --------------------- |
| `add`      | Add `a` and `b`       |
| `subtract` | Subtract `b` from `a` |
| `multiply` | Multiply `a` and `b`  |
| `divide`   | Divide `a` by `b`     |
| `negate`   | Negates `a`           |

Example request body:

```json
{
  "operation": "add",
  "a": 2,
  "b": 3
}
```

Example response:

```json
{
  "result": 5
}
```

**Graduate Extension:**

Added a `negate` method.

Request Body:

```json
{
    "operation": "negate",
    "a": 7
}
```

Response:

```json
{
    "result": -7
}
```

The server returns an error response for unsupported operations.

### `GET /requests`

Returns information about how many requests the server has handled since it started.

**Graduate Extension:**

Tracks the requests by which route was invoked. Consider the following example response body:

```json
{
  "/echo": 3,
  "/requests": 1,
  "/calculate": 8
}
```

## Running the Lab

First, move into the starter directory:

```bash
cd labs/lab02-http-json/starter
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run server
```

By default, the server should listen on port `3000`.

You can test the server in a browser by visiting:

```text
http://localhost:3000/health
```

You can also test it with `curl`.

Example:

```bash
curl http://localhost:3000/health
```

Example `POST /echo` request:

```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

Example `POST /calculate` request:

```bash
curl -X POST http://localhost:3000/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","a":2,"b":3}'
```

## Configuring the Port

The server should use port `3000` by default.

You can run the server on a different port by setting the `PORT` environment variable:

```bash
PORT=4000 npm run server
```

Then send requests to the new port:

```bash
curl http://localhost:4000/health
```

## Testing

This lab includes automated tests for the HTTP JSON service.

Run the tests from the starter directory:

```bash
npm test
```

The tests check behavior such as:

* `GET /health` returns a JSON status response.
* `POST /echo` returns the submitted JSON data.
* `POST /calculate` performs supported calculations.
* Unknown routes return an error.
* Invalid JSON returns an error.
* The server does not crash on bad input.

**Graduate Extension:**

Tests also check the following:
- New `GET /requests` body format
    - Rather than checking for the `count` key, `/requests` returns key/value pairs where each key is a URL/"route" and the value is the number of requests to that route so far.
    - The test loops through all the URLs accessed, determines if `/requests` counted them, and ensures those count values are numbers.
- New `POST /calculate` operation (`negate`)
- New `POST /uppercase` route

## Reflection Questions

1. What is the difference between a TCP message and an HTTP request?

    - TCP messages send raw bytes across the client/server connection.
    
    - HTTP requests have a particular structure, in addition to the rules TCP lays out for its usage (because HTTP exists on top of TCP).

    - For example, HTTP requests need a `Host` header. Without it, the request is invalid according to HTTP. It also has other formatting necessities like a valid method (`POST`, `GET`, etc).

    - Basically, HTTP has more rules for sending requests than TCP has for sending messages.

2. What does the `Content-Type: application/json` header tell the server?

    - Originally I would have said that it tells the server the request is a POST request, or has the POST method to be more precise.

    - However, the `method: "POST"` key/value pair is already included in the request.
    
    - So, while the titular question's header is merely another indication to the reader that it's a POST request, for the server it specifies the data that the client wants the server to use in processing the request.

3. Why should a server return different HTTP status codes for different situations?

    - To inform the client how their request was processed.

    - It may be unclear based on the response body whether the client request was processed successfully or not, and the nature of that success or failure.
    
    - Status codes are clear indications by the developer as to how the server handled the client's request.

4. What happens if the client sends invalid JSON?

    - It depends on how the server is programmed to respond.
    
    - In this lab, my POST requests reject invalid JSON with a 400 status code.

    - However, other servers may not anticipate invalid JSON and their scripts will just crash, requiring a server restart.

5. How is this lab different from Lab 1?

    - Rather than accepting TCP messages, the server expects HTTP requests.

    - TCP messages require some clientside setup (client.js in lab 1) because a socket first needs to be used to send messages through.

    - HTTP presumably handles this at request time, allowing us to use a single curl command in the terminal rather than needing a clientside script.