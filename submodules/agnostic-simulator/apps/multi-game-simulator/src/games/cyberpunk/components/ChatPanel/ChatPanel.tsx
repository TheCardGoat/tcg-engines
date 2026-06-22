import {
  CHAT_MAX_LENGTH,
  CHAT_PRESET_KEYS,
  CHAT_PRESETS,
  chatMessageText,
  useEngine,
  type ChatMessage as EngineChatMessage,
} from "../../engine";
import {
  ChatPanel as SharedChatPanel,
  type ChatMessage as SharedChatMessage,
} from "@tcg/simulator-ui";

const TIME_FMT = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function ChatPanel({ compact = false }: { compact?: boolean } = {}) {
  const { chatMessages, sendChatPreset, sendChatText, humanSide } = useEngine();

  const messages: SharedChatMessage[] = chatMessages.map((m) => mapChatMessage(m, humanSide));
  const presets = CHAT_PRESET_KEYS.map((key) => ({
    id: key,
    label: CHAT_PRESETS[key],
  }));

  return (
    <SharedChatPanel
      messages={messages}
      presets={presets}
      maxLength={CHAT_MAX_LENGTH}
      placeholder="Type a message…"
      onSendText={sendChatText}
      onSendPreset={(id) =>
        sendChatPreset(id as import("@tcg/simulator-runtime/chat").ChatPresetKey)
      }
      compact={compact}
    />
  );
}

function mapChatMessage(
  message: EngineChatMessage,
  humanSide: "player" | "opponent",
): SharedChatMessage {
  const timestamp = TIME_FMT.format(new Date(message.timestamp));
  if (message.kind === "system") {
    return {
      id: String(message.id),
      senderSide: "system",
      senderLabel: "System",
      text: message.text,
      timestamp,
    };
  }
  const isYou = message.senderSide === humanSide;
  return {
    id: String(message.id),
    senderSide: message.senderSide,
    senderLabel: isYou ? "You" : "Rival",
    text: chatMessageText(message),
    timestamp,
  };
}
