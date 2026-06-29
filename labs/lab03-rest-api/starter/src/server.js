import express from "express";
import { request } from "http";

let invalidItemSpecErr = "Invalid item specification. Ensure quantity is a number >= 0, and name is a non-empty string."
let itemNotFoundErr = "Item not found"
let invalidIdErr = "Invalid item ID"

// Implement type checking along with sanity checks per the graduate feature.
export function itemHasValidNameAndQuantity(obj) {
    let name = obj.name
    let quantity = obj.quantity
    return typeof name == "string"
        && typeof quantity == "number"
        && name.length != 0
        && quantity >= 0
}

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
        return items.find(item => item.id === id)
    }

    function checkForItemIdAndThen(id, res, succeed) {
        id = Number(id) // id starts off as a string
        // console.log(id)
        // if the `Number` call fails to convert `id` from string to number, ...
        // ... then js treats `id` as NaN, and so we make that part of the type check
        // so a typeof check would do nothing here
        if (!isNaN(id)) {
            let foundItem = findItemById(id)
            if (foundItem) {
                succeed(foundItem)
            } else {
                res.status(404).json({ error: itemNotFoundErr })
            }
        } else {
            res.status(400).json({ error: invalidIdErr })
        }
    }

    // GET health
    app.get("/health", (req, res) => {
        // console.log(req)
        res.json({ status: "ok" });
    });

    // GET all items
    app.get("/items", (req, res) => {
        res.json(items)
    });

    // GET by id
    app.get("/items/:id", (req, res) => {
        checkForItemIdAndThen(req.params.id, res, (foundItem) => {
            // this function (third argument) is called with the found item
            // but only upon successfully finding them item; otherwise 400 or 404 is emitted.
            res.json(foundItem) // status is 200 unless otherwise specified
        })
    });

    // POST
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

    // PUT
    app.put("/items/:id", (req, res) => {
        if (itemHasValidNameAndQuantity(req.body)) {
            checkForItemIdAndThen(req.params.id, res, (foundItem) => {
                foundItem.name = req.body.name
                foundItem.quantity = req.body.quantity
                res.json(foundItem)
            })
        } else {
            res.status(400).json({ error: invalidItemSpecErr })
        }
    });

    // DELETE
    app.delete("/items/:id", (req, res) => {
        checkForItemIdAndThen(req.params.id, res, (foundItem) => {
            let index = items.indexOf(foundItem)
            items.splice(index, 1)
            res.status(204).end() // end means the interaction is over
            // no response body.
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
