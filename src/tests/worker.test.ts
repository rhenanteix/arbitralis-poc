import { describe, it, expect, vi, beforeEach } from "vitest";

import { queue, deadLetterQueue } from "../queue/inMemoryQueue";
import { processNextJob } from "../queue/worker";

import * as negotiationService from "../services/negotiation.service";

describe("Worker", () => {
  beforeEach(() => {
    queue.splice(0, queue.length);

    deadLetterQueue.splice(
      0,
      deadLetterQueue.length
    );

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

  it("deve reenfileirar quando ocorrer erro", async () => {
    vi.spyOn(
      negotiationService,
      "processNegotiation"
    ).mockRejectedValue(
      new Error("LLM timeout")
    );

    queue.push({
      payload: {
        messageId: "2",
        userId: "123",
        message: "teste",
      },
      retries: 0,
    });

    await processNextJob();

    expect(queue.length).toBe(1);

    expect(queue[0].retries).toBe(1);

    expect(deadLetterQueue.length).toBe(0);
  });

  it("deve mover para DLQ após limite de tentativas", async () => {
    vi.spyOn(
      negotiationService,
      "processNegotiation"
    ).mockRejectedValue(
      new Error("LLM timeout")
    );

    queue.push({
      payload: {
        messageId: "3",
        userId: "123",
        message: "teste",
      },
      retries: 3,
    });

    await processNextJob();

    expect(queue).toHaveLength(0);

    expect(deadLetterQueue)
      .toHaveLength(1);

    expect(
      deadLetterQueue[0].payload.messageId
    ).toBe("3");
  });
});