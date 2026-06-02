import Fastify from "fastify";
import { webhookRoute } from "./routes/webhook.route";
import { healthRoute } from "./routes/health.route";
import { dlqRoute } from "./routes/dlq.route";

export function buildApp() {
  const app = Fastify();

  app.register(webhookRoute);
  app.register(healthRoute);
  app.register(dlqRoute);

  return app;
}