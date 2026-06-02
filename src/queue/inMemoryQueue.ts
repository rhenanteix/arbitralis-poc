import { WebhookPayload }
from "../types/webhook";

export interface QueueJob {
  payload: WebhookPayload;
  retries: number;
}

export const queue: QueueJob[] = [];

export const deadLetterQueue: QueueJob[] = [];