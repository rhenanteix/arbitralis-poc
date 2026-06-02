import {
  queue,
  deadLetterQueue,
} from "./inMemoryQueue";

import { processNegotiation } from "../services/negotiation.service";

const MAX_RETRIES = 3;

export async function processNextJob() {
  const job = queue.shift();

  if (!job) {
    return;
  }

  try {
    await processNegotiation(job.payload);

    console.log(
      `[SUCCESS] ${job.payload.messageId}`
    );
  } catch (error) {
    console.error(
      `[ERROR] ${job.payload.messageId}`
    );

    if (job.retries < MAX_RETRIES) {
      queue.push({
        ...job,
        retries: job.retries + 1,
      });
    } else {
      deadLetterQueue.push(job);

      console.error(
        `[DLQ] ${job.payload.messageId}`
      );
    }
  }
}

export function startWorker() {
  setInterval(async () => {
    await processNextJob();
  }, 1000);
}