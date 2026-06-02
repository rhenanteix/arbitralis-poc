import { describe, expect, it } from "vitest";
import { buildApp } from "../app";

describe("Webhook", () => {
  it("deve aceitar requisição", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/webhook",
      payload: {
        messageId: "1",
        userId: "123",
        message: "teste",
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.status).toBe("accepted");
  });
});