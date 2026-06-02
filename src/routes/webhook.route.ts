import { FastifyInstance } from "fastify";

import { queue }
from "../queue/inMemoryQueue";

export async function webhookRoute(
  app: FastifyInstance
) {

  app.post(
    "/webhook",
    async (request, reply) => {

      const payload: any =
        request.body;

      queue.push({
        payload,
        retries: 0
      });

      return reply.status(200).send({
        status: "accepted",
        messageId:
          payload.messageId
      });
    }
  );
}