export async function sendMessage(
  userId: string,
  text: string
) {
  console.log(
    `[OUTBOUND] POST /mock-whatsapp/send`
  );

  console.log({
    userId,
    text
  });

  return {
    success: true
  };
}