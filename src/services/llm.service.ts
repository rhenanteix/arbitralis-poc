export async function processWithLLM(
  message: string
): Promise<string> {

  const delay = Math.random() * 5000;

  await new Promise(resolve =>
    setTimeout(resolve, delay)
  );

  const fail = Math.random() < 0.3;

  if (fail) {
    throw new Error("LLM timeout");
  }

  return `Acordo gerado para: ${message}`;
}