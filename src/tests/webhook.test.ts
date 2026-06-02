import { describe, it, expect }
from "vitest";

import request
from "supertest";

import { buildApp }
from "../app";

describe(
  "Webhook",
  () => {

    it(
      "deve aceitar requisição",
      async () => {

        const app =
          buildApp();

        const response =
          await request(
            app.server
          )
          .post("/webhook")
          .send({
            messageId: "1",
            userId: "abc",
            message: "teste"
          });

        expect(
          response.status
        ).toBe(200);
      }
    );
  }
);