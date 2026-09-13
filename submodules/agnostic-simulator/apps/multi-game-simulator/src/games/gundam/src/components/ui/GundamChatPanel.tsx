import {
  ChatPanel as SharedChatPanel,
  type ChatMessage as SharedChatMessage,
} from "@tcg/simulator-ui";

import {
  CHAT_MAX_LENGTH,
  CHAT_PRESET_KEYS,
  CHAT_PRESETS,
  chatMessageText,
  type ChatPresetKey,
  type GundamChatMessage,
} from "../../game/chat.ts";
import { useGundamChat } from "../../game/chat-context.tsx";
import { m } from "../../lib/i18n/messages.ts";

/**
 * Adapter mapping gundam chat state onto the shared, game-agnostic
 * ChatPanel. Mirrors cyberpunk's components/ChatPanel wrapper.
 */
export function GundamChatPanel({
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
  } = useGundamChat();

  const messages: SharedChatMessage[] = chatMessages.map(mapGundamChatMessage);
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
      placeholder={m["sim.chat.inputPlaceholder"]()}
      onSendText={sendChatText}
      onSendPreset={(id) => sendChatPreset(id as ChatPresetKey)}
      onRequestFreeText={requestFreeTextChat}
      compact={compact}
      showMessages={showMessages}
      layout={layout}
    />
  );
}

export function mapGundamChatMessage(message: GundamChatMessage): SharedChatMessage {
  if (message.kind === "system") {
    return {
      id: String(message.id),
      senderSide: "system",
      senderLabel: m["sim.chat.sender.system"](),
      text: message.text,
      timestamp: new Date(message.timestamp).toISOString(),
    };
  }
  const isYou = message.senderSide === "player";
  return {
    id: String(message.id),
    senderSide: message.senderSide,
    senderLabel: isYou ? m["sim.chat.sender.you"]() : m["sim.chat.sender.rival"](),
    text: chatMessageText(message),
    timestamp: new Date(message.timestamp).toISOString(),
  };
}
