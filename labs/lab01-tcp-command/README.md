# TCP Command Center

## Command Protocol

The server accepts one text command per line.

Commands are case-insensitive, but the command arguments should be handled as normal text.

| Client sends    | Server responds     |
| --------------- | ------------------- |
| `ECHO hello`    | `hello`             |
| `UPPER hello`   | `HELLO`             |
| `LOWER HELLO`   | `hello`             |
| `REVERSE hello` | `olleh`             |
| `QUIT`          | closes connection   |
| unknown command | error message       |

## Running the Lab

First, move into the starter directory:

```
cd labs/lab01-tcp-command/starter
```

Install dependencies:

```
npm install
```

Start the server:

```
npm run server
```

In a second terminal, move into the same starter directory and run the client:

```
npm run client
```

You should be able to type commands into the client and see responses from the server.

Example:

```
> ECHO hello
hello

> UPPER hello
HELLO

> QUIT
Goodbye.
```

## Configuring the Port

The server should use port `3000` by default.

You can run the server on a different port by setting the `PORT` environment variable.

In PowerShell, on Windows:

```
$env:PORT=4000; npm run server
```

Then run the client using the same port:

```
$env:PORT=4000; npm run client
```

## Reflection Questions

1. What is the difference between the client and the server?

    - The client is the user's computer. When you open your browser and type a URL into the address bar, your computer is the client requesting a webpage from the server.

    - The server is the computer that responds to the client's request. It can supply the client with what it requested, or reject requests as it sees fit. Typically, the server is not in the same location as the client.

2. Why does the server need to keep running after handling one request?

    - Servers are designed to respond to multiple requests. Not only does it need to respond to multiple of the same request from many users, but it also needs to respond to different requests from the same user.

    - A server that closes after one request is not particularly useful. It's in the name; a server 'serves' data like webpages. It could do said serving far more than one time.

3. What happens if two clients connect at the same time?

    - Servers, like all computers, work at much faster timescales than humans comprehend in our day-to-day lives.
    
    - While it's unlikely that two clients on a small server like this will connect at the exact same server clock cycle, there is doubtless a contingency for that. Presumably servers will create a queue and process each client's request one by one, perhaps in order of IP address.

4. How is this different from HTTP?

    - TCP remembers the data from prior requests, aka the 'context', while HTTP is "stateless" in that each request is treated as if there were no prior requests from that client.

    - HTTP operates on a higher level than TCP, in that the former does not process the raw bits associated with each request.