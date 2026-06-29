import express from "express";
import { request } from "http";

// Implement type checking along with sanity checks per the graduate feature.
function itemHasValidNameAndQuantity(requestBody) {
    let name = requestBody.name
    let quantity = requestBody.quantity
    return typeof name == "string"
        && typeof quantity == "number"
        && name.length != 0
        && quantity >= 0
}

let invalidItemSpecErr = `Invalid item specification.
    Ensure the name and quantity fields exist, and that
    the name field is a string with at least 1 character,
    and the quantity field is a number that is at least 0.`

let itemNotFoundErr = "Item not found"
let invalidIdErr = "Invalid item ID"

export function createApp() {
    const app = express();

    app.use(express.json());

    // Starter data. This data is stored in memory and will reset when the
    // server restarts.
    let nextId = 3;
    const items = [
        { id: 1, name: "keyboard", quantity: 10 },
        { id: 2, name: "mouse", quantity: 5 }
    ];

    function findItemById(id) {
        // look in the items array for a dictionary with the matching id
        return items.find(item => item.id === req.body.id)
    }

    function checkForItemIdAndThen(id, emitStatus, succeed) {
        // if (itemHasValidNameAndQuantity(req.body) && typeof req.params.id == "number") {
        //     let foundItem = findItemById(req.params.id)
        //     if (foundItem) {
        //         succeed(foundItem)
        //     } else {
        //         res.status(404).json({ error: itemNotFoundErr })
        //     }
        // } else {
        //     res.status(400).json({ error: invalidItemSpecErr })
        // }
        if (typeof id == "number") {
            let foundItem = findItemById(req.params.id)
            if (foundItem) {
                succeed(foundItem)
            } else {
                emitStatus(404).json({ error: itemNotFoundErr })
            }
        } else {
            emitStatus(400).json({ error: invalidIdErr })
        }
    }

    app.get("/health", (req, res) => {
        // console.log(req)
        res.json({ status: "ok" });
    });

    app.get("/items", (req, res) => {
        res.json(items)
    });

    app.get("/items/:id", (req, res) => {
        checkForItemIdAndThen(req.body.id, res.status, (foundItem) => {
            // this function (third argument) is called with the found item
            // but only upon successfully finding them item; otherwise 400 or 404 is emitted.
            res.json(foundItem) // status is 200 unless otherwise specified
        })
    });

    app.post("/items", (req, res) => {
        if (itemHasValidNameAndQuantity(req.body)) {
            let newItem = { id: nextId, name: req.body.name, quantity: req.body.quantity }
            items.push(newItem)
            nextId++;
            res.status(201).json(newItem)
        } else {
            res.status(400).json({ error: invalidItemSpecErr })
        }
    });

    app.put("/items/:id", (req, res) => {
        if (itemHasValidNameAndQuantity(req.body)) {
            checkForItemIdAndThen(req.body.id, res.status, (foundItem) => {
                foundItem.name = req.body.name
                foundItem.quantity = req.body.quantity
                res.json(foundItem)
            })
        } else {
            res.status(400).json({ error: invalidItemSpecErr })
        }
    });

    app.delete("/items/:id", (req, res) => {
        checkForItemIdAndThen(req.body.id, res.status, (foundItem) => {
            let index = items.indexOf(foundItem)
            items.splice(index, 1)
            res.status(204)
        })
    });

    app.use((req, res) => {
        res.status(404).json({ error: "Resource not found" });
    });

    return app;
}

// const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;
import { fileURLToPath } from "url";
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
    const PORT = process.env.PORT || 3000;
    const app = createApp();

    app.listen(PORT, () => {
        console.log(`Lab 3 REST API listening on port ${PORT}`);
    });
}
