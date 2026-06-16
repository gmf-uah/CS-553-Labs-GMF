import http from "node:http";
import { stringify } from "node:querystring";

const DEFAULT_PORT = 3000;

let requestCounts = {};

export function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(body));
}

export function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            if (body.trim() === "") {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
}

export function handleCalculate(body) {
    var result;
    var errMsg = "Invalid operation or operands.";
    let success = true;
    if (body.operation === "negate" && typeof body.a == "number") {
        result = -body.a
    } else if (typeof body.a == "number" && typeof body.b == "number") {
        // type check. if a & b not both numbers, error.
        switch (body.operation) {
        case "add":
            result = body.a + body.b;
            break;
        case "subtract":
            result = body.a - body.b;
            break;
        case "multiply":
            result = body.a * body.b;
            break;
        case "divide": {
            if (body.b !== 0) {
                result = body.a / body.b;
                break;
            }
            // else, fall through to default case and error.
            // We error here because the user attempted to divide by zero.
        }
        default:
            success = false;
            result = errMsg;
            break;
        }
    } else {
        success = false;
        result = errMsg;
    }

    let statusCode = success && 200 || 400 
    return success && {
        statusCode: statusCode,
        response: {
            result: result
        }
    } || {
        statusCode: statusCode,
        response: {
            error: result
        }
    }

    // old stuff, pre-implementation.
    // return {
    //     statusCode: 501,
    //     response: {
    //         error: "Calculation not implemented yet"
    //     }
    // };
}

export async function requestHandler(req, res) {
    const method = req.method;
    const url = req.url;
    // console.log("handling request", method, url)
    let valid = true;

    let exception = false;
    // the exception variable is what makes it so that `/requests` shows that its own route was incremented.
    // basically, all routes are executed BEFORE their route count is incremented, because their execution is what determines the request validity.
    // however, we make an exception for `/requests` by incrementing it before calling `sendJson`.
    // then, we don't later increment the route again.

    switch(method) { // converted to a switch case for prettiness & ease of use of the `valid` var
    case "GET":
        switch(url) {
        case "/health":
            sendJson(res, 200, { status: "ok" });
            break;
        case "/requests":
            exception = true;
            if (requestCounts[url] == null) {
                requestCounts[url] = 0;
            }
            requestCounts[url]++;
            sendJson(res, 200, requestCounts);
            break;
        default:
            valid = false;
            break;
        }
        break; // js requires the break spam for switch case too :/
    case "POST":
        switch(url) {
        case "/echo": // copied this solution from the examples directory of the repo
            try {
                const body = await readJsonBody(req);
                sendJson(res, 200, body);
            } catch {
                sendJson(res, 400, { error: "Invalid JSON" });
            }
            break;
        case "/calculate": {
            try {
                const body = await readJsonBody(req);
                const result = handleCalculate(body);

                sendJson(res, result.statusCode, result.response);
            } catch {
                sendJson(res, 400, { error: "Invalid JSON" });
            }
            break;
        }
        case "/uppercase": {
            try {
                const body = await readJsonBody(req);
                body.message = body.message.toUpperCase();
                sendJson(res, 200, body);
            } catch {
                sendJson(res, 400, { error: "Invalid JSON" });
            }
            break;
        }
        default:
            valid = false;
            break;
        }
        break;
    default:
        valid = false;
        break;
    }

    if (valid) {
        if (!exception) {
            if (requestCounts[url] == null) {
                requestCounts[url] = 0;
            }
            requestCounts[url]++;
            // console.log("new request count for url", url);
            // console.log(requestCounts);
        }
    } else {
        sendJson(res, 404, { error: "Not found" });
    }
}

export function createServer() {
    return http.createServer(requestHandler);
}

export function resetState() {
    for (let key in requestCounts) {
        delete requestCounts[key]
    }
}

import { pathToFileURL } from "node:url";
// apparently there was an issue before with the filepath comparison condition
// this caused server.listen to never be called, so the server closes immediately (never even opens)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const port = process.env.PORT || DEFAULT_PORT;
    const server = createServer();

    server.listen(port, () => {
        console.log(`HTTP JSON server listening on port ${port}`);
    });

    // function shutdown() {
    //     server.close(() => {
    //         resetState();
    //         process.exit(0);
    //     });
    // }

    // process.on("SIGTERM", shutdown);
    // process.on("SIGINT", shutdown);
}