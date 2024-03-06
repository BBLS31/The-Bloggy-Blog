const request = require("supertest");
const app = require("./server");

describe("GET /users", () => {
  it("responds with a 200 status code", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
  });
});
