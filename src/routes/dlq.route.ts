import {
  deadLetterQueue
}
from "../queue/inMemoryQueue";

import {
  FastifyInstance
}
from "fastify";

export async function dlqRoute(
  app: FastifyInstance
) {

  app.get(
    "/dlq",
    async () => {

      return {
        total:
          deadLetterQueue.length,
        jobs:
          deadLetterQueue
      };
    }
  );
}