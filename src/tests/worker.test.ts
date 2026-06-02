import { describe, it, expect, vi, beforeEach } from "vitest";

import { queue, deadLetterQueue } from "../queue/inMemoryQueue";
import { processNextJob } from "../queue/worker";

import * as negotiationService from "../services/negotiation.service";

describe("Worker", () => {
  beforeEach(() => {
    queue.length = 0;
    deadLetterQueue.length = 0;

    vi.restoreAllMocks();
  });

  it("deve processar mensagem com sucesso", async () => {
    vi.spyOn(
      negotiationService,
      "processNegotiation"
    ).mockResolvedValue(undefined);

    queue.push({
      payload: {
        messageId: "1",
        userId: "123",
        message: "teste",
      },
      retries: 0,
    });

    await processNextJob();

    expect(queue.length).toBe(0);
    expect(deadLetterQueue.length).toBe(0);
  });
});