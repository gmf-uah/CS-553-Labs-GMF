import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp, itemHasValidNameAndQuantity } from "../src/server.js";

describe("Lab 3 starter", () => {
    test("GET /health returns status ok", async () => {
        const app = createApp();

        const response = await request(app)
            .get("/health")
            .expect(200);

        expect(response.body).toEqual({ status: "ok" });
    });

    test("GET /items returns list of valid items", async () => {
        const app = createApp();

        const response = await request(app)
            .get("/items")
            .expect(200);

        let allItemsValid = true
        for (let item of response.body) {
            // console.log(item.id, typeof item.id, typeof item.id == "number")
            if (!itemHasValidNameAndQuantity(item) || typeof item.id != "number") {
                // console.log("invalid")
                allItemsValid = false
                break
            }
        }
        // ensure all items have valid id, name, and quantity fields
        expect(allItemsValid).toBeTruthy()
    });

    test("POST /items creates new item", async () => {
        const app = createApp();

        const response = await request(app)
            .post("/items")
            .send({ name: "monitor", quantity: 4 })
            .expect(201);

        expect(itemHasValidNameAndQuantity(response.body)).toBeTruthy();
    });

    test("POST /items rejects invalid item structure", async () => {
        const app = createApp();

        const response = await request(app)
            .post("/items")
            .send({ quantity: "purple" })
            .expect(400);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("POST /items rejects invalid name", async () => {
        const app = createApp();

        const response = await request(app)
            .post("/items")
            .send({ name: "", quantity: 4 })
            .expect(400);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("POST /items rejects invalid quantity", async () => {
        const app = createApp();

        const response = await request(app)
            .post("/items")
            .send({ name: "monitor", quantity: -1 })
            .expect(400);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("GET /items/:id can retrieve an item", async () => {
        const app = createApp();

        const response = await request(app)
            .get("/items/2")
            .expect(200);

        expect(itemHasValidNameAndQuantity(response.body)).toBeTruthy();
    });

    test("GET /items/:id rejects invalid id", async () => {
        const app = createApp();

        const response = await request(app)
            .get("/items/qwerty")
            .expect(400);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("GET /items/:id rejects item not found", async () => {
        const app = createApp();

        const response = await request(app)
            .get("/items/3")
            .expect(404);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("PUT /items/:id updates an item", async () => {
        const app = createApp();

        const response = await request(app)
            .put("/items/1")
            .send({ name: "mechanical keyboard", quantity: 12 })
            .expect(200);
        // console.log("PUT response:", response.body, "PUT status:", response.status)

        expect(itemHasValidNameAndQuantity(response.body)).toBeTruthy();
        expect(response.body.name).toEqual("mechanical keyboard");
        expect(response.body.quantity).toEqual(12);
    });

    test("PUT /items/:id rejects invalid id", async () => {
        const app = createApp();

        const response = await request(app)
            .put("/items/qwerty")
            .send({ name: "mechanical keyboard", quantity: 12 })
            .expect(400);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("PUT /items/:id rejects item not found", async () => {
        const app = createApp();

        const response = await request(app)
            .put("/items/3")
            .send({ name: "mechanical keyboard", quantity: 12 })
            .expect(404);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("PUT /items/:id rejects invalid name", async () => {
        const app = createApp();

        const response = await request(app)
            .put("/items/1")
            .send({ name: "", quantity: 12 })
            .expect(400);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("PUT /items/:id rejects invalid quantity", async () => {
        const app = createApp();

        const response = await request(app)
            .put("/items/1")
            .send({ name: "mechanical keyboard", quantity: -1 })
            .expect(400);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("DELETE /items/:id deletes an item", async () => {
        const app = createApp();

        const response = await request(app)
            .delete("/items/2")
            .expect(204);
    });

    test("DELETE /items/:id rejects invalid id", async () => {
        const app = createApp();

        const response = await request(app)
            .delete("/items/qwerty")
            .expect(400);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });

    test("DELETE /items/:id rejects item not found", async () => {
        const app = createApp();

        const response = await request(app)
            .delete("/items/3")
            .expect(404);

        expect(itemHasValidNameAndQuantity(response.body)).toBeFalsy();
    });
});