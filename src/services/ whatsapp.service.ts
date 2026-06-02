export async function sendMessage(
  userId: string,
  text: string
) {
  console.log(
    `[OUTBOUND] Mensagem enviada para ${userId}`
  );

  console.log(text);
}