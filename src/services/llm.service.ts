function sleep(ms: number) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}

export async function processWithLLM(
  message: string
): Promise<string> {

  const delay =
    Math.floor(
      1000 +
      Math.random() * 4000
    );

  console.log(
    `[LLM] Processando (${delay}ms)`
  );

  await sleep(delay);

  const random =
    Math.random();

  if (random < 0.15) {
    throw new Error(
      "Provider timeout"
    );
  }

  if (random < 0.25) {
    throw new Error(
      "Rate limit exceeded"
    );
  }

  if (random < 0.35) {
    throw new Error(
      "Provider unavailable"
    );
  }

  return `Acordo gerado para: ${message}`;
}