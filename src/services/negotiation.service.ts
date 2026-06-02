import { processWithLLM } from "./llm.service";
import { sendMessage } from "./ whatsapp.service"
import { WebhookPayload } from "../types/webhook";

export async function processNegotiation(
  payload: WebhookPayload
) {

  const response = await processWithLLM(
    payload.message
  );

  await sendMessage(
    payload.userId,
    response
  );
}