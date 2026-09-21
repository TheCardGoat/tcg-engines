import { NativeServerMessage, type NativeClientMessage } from "@tcg/protocol/native";

/** Automated client only: all game actions cross the public JSON socket. */
export async function connectNative(url: string, credential: string) {
  const socket = new WebSocket(url);
  const messages: NativeServerMessage[] = [];
  const transcript: { direction: "in" | "out"; message: unknown }[] = [];
  socket.addEventListener("message", (event) => {
    const message = NativeServerMessage.parse(JSON.parse(String(event.data)));
    messages.push(message);
    transcript.push({ direction: "in", message: structuredClone(message) });
  });
  await new Promise<void>((resolve, reject) => {
    socket.addEventListener("open", () => resolve(), { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  async function wait<T extends NativeServerMessage["type"]>(
    type: T,
  ): Promise<Extract<NativeServerMessage, { type: T }>> {
    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      const index = messages.findIndex((message) => message.type === type);
      if (index >= 0) {
        const message = messages.splice(index, 1)[0]!;
        if (message.type === type) return message as Extract<NativeServerMessage, { type: T }>;
      }
      await Bun.sleep(2);
    }
    throw new Error(`Timed out waiting for ${type}: ${JSON.stringify(messages).slice(0, 500)}`);
  }
  function send(message: NativeClientMessage) {
    if (message.type !== "hello") transcript.push({ direction: "out", message });
    socket.send(JSON.stringify(message));
  }
  send({ v: 1, type: "hello", credential });
  await wait("welcome");
  return { socket, messages, transcript, send, wait };
}
