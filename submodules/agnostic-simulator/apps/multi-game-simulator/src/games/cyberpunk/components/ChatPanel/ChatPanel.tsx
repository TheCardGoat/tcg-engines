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

export function ChatPanel({
  compact = false,
  showMessages = true,
  layout = "default",
}: {
  compact?: boolean;
  showMessages?: boolean;
  layout?: "default" | "mobile-drawer";
} = {}) {
  const {
    chatMessages,
    canSendChat,
    freeTextEnabled,
    freeTextProposalPending,
    canRequestFreeText,
    requestFreeTextChat,
    sendChatPreset,
    sendChatText,
    humanSide,
  } = useEngine();

  const messages: SharedChatMessage[] = chatMessages.map((m) => mapChatMessage(m, humanSide));
  const presets = CHAT_PRESET_KEYS.map((key) => ({
    id: key,
    label: CHAT_PRESETS[key],
  }));

  return (
    <SharedChatPanel
      messages={messages}
      presets={presets}
      canSend={canSendChat}
      freeTextEnabled={freeTextEnabled}
      freeTextProposalPending={freeTextProposalPending}
      canRequestFreeText={canRequestFreeText}
      maxLength={CHAT_MAX_LENGTH}
      placeholder="Type a message…"
      onSendText={sendChatText}
      onSendPreset={(id) =>
        sendChatPreset(id as import("@tcg/simulator-runtime/chat").ChatPresetKey)
      }
      onRequestFreeText={requestFreeTextChat}
      compact={compact}
      showMessages={showMessages}
      layout={layout}
    />
  );
}

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
