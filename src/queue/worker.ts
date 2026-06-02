import {
  queue,
  deadLetterQueue,
} from "./inMemoryQueue";

import { processNegotiation } from "../services/negotiation.service";

const MAX_RETRIES = 3;

export async function processNextJob() {
  console.log(
    `[WORKER] Queue size: ${queue.length}`
  );

  const job = queue.shift();

  if (!job) {
    return;
  }

  console.log(
    `[WORKER] Processando ${job.payload.messageId}`
  );

  try {
    await processNegotiation(
      job.payload
    );

    console.log(
      `[SUCCESS] ${job.payload.messageId}`
    );

  } catch (error) {

    console.error(
      `[ERROR] ${job.payload.messageId}`
    );

    console.error(error);

    console.log(
      `[RETRIES] ${job.retries}`
    );

    if (job.retries < MAX_RETRIES) {

      console.log(
        `[REQUEUE] ${job.payload.messageId}`
      );

      queue.push({
        ...job,
        retries: job.retries + 1,
      });

      console.log(
        `[QUEUE SIZE] ${queue.length}`
      );

    } else {

      console.log(
        `[DLQ] ${job.payload.messageId}`
      );

      deadLetterQueue.push(job);

      console.log(
        `[DLQ SIZE] ${deadLetterQueue.length}`
      );
    }
  }
}

export function startWorker() {

  console.log(
    "[WORKER] Iniciado"
  );

  setInterval(async () => {

    try {
      await processNextJob();
    } catch (error) {

      console.error(
        "[WORKER] Erro inesperado"
      );

      console.error(error);
    }

  }, 1000);
}