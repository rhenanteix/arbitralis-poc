import Fastify from "fastify";

import {
  webhookRoute
} from "./routes/webhook.route";

export function buildApp() {

  const app = Fastify();

  app.register(
    webhookRoute
  );

  return app;
}