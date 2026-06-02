function sleep(ms: number) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}

export async function processWithLLM(
  message: string
): Promise<string> {

  const delay = 1000;

  await sleep(delay);

  throw new Error("Provider timeout");
}