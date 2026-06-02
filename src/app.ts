import Fastify from "fastify";
import { webhookRoute } from "./routes/webhook.route";
import { healthRoute } from "./routes/health.route";

export function buildApp() {
  const app = Fastify();

  app.register(healthRoute);

  return app;
}