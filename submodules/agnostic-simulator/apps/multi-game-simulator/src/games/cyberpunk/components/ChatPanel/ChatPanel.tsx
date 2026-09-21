import { chatMessageText, type ChatMessage as EngineChatMessage } from "../../engine";
import type { ChatMessage as SharedChatMessage } from "@tcg/simulator-ui";

export function mapChatMessage(
  message: EngineChatMessage,
  humanSide: "player" | "opponent",
): SharedChatMessage {
  if (message.kind === "system") {
    return {
      id: String(message.id),
      senderSide: "system",
      senderLabel: "System",
      text: message.text,
      timestamp: new Date(message.timestamp).toISOString(),
    };
  }
  const isYou = message.senderSide === humanSide;
  return {
    id: String(message.id),
    senderSide: message.senderSide,
    senderLabel: isYou ? "You" : "Rival",
    text: chatMessageText(message),
    timestamp: new Date(message.timestamp).toISOString(),
  };
}
