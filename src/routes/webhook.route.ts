import { FastifyInstance } from "fastify";
import { queue } from "../queue/inMemoryQueue";
import { processedMessages } from "../store/idempotency";

export async function webhookRoute(
  app: FastifyInstance
) {
app.post("/webhook", async (request, reply) => {

  const payload: any = request.body;

  if (
    processedMessages.has(
      payload.messageId
    )
  ) {
    return reply.send({
      status: "duplicate"
    });
  }

  processedMessages.add(
    payload.messageId
  );

  queue.push({
    payload,
    retries: 0
  });

  return reply.send({
    status: "accepted"
  });
});
}