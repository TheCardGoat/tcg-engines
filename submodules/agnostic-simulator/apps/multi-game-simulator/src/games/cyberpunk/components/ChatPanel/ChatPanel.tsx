import { useEffect, useState } from "react";
import {
  ChatPanel as SharedChatPanel,
  type SimulatorActivityTab,
  type SimulatorMatchActivity,
} from "@tcg/simulator-ui";
import {
  CHAT_MAX_LENGTH,
  CHAT_PRESET_KEYS,
  CHAT_PRESETS,
  useEngine,
  chatMessageText,
  type ChatMessage as EngineChatMessage,
} from "../../engine";
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

/** Keep consent, spectator restrictions, presets, and unread state in the game adapter. */
export function useCyberpunkChatActivity(
  visible = true,
): Pick<
  SimulatorMatchActivity,
  "chat" | "chatLabel" | "activeTab" | "onActiveTabChange" | "keepMounted"
> {
  const {
    chatMessages,
    humanSide,
    canSendChat,
    freeTextEnabled,
    freeTextProposalPending,
    canRequestFreeText,
    requestFreeTextChat,
    sendChatPreset,
    sendChatText,
  } = useEngine();
  const [activeTab, setActiveTab] = useState<SimulatorActivityTab>("log");
  const lastMessageId = chatMessages.at(-1)?.id;
  const [lastReadId, setLastReadId] = useState(lastMessageId);
  useEffect(() => {
    if (visible && activeTab === "chat") setLastReadId(lastMessageId);
  }, [activeTab, lastMessageId, visible]);
  const lastReadIndex = chatMessages.findIndex((message) => message.id === lastReadId);
  const unread =
    visible && activeTab === "chat"
      ? 0
      : chatMessages
          .slice(lastReadIndex + 1)
          .filter((message) => message.kind !== "system" && message.senderSide !== humanSide)
          .length;
  return {
    keepMounted: true,
    activeTab,
    onActiveTabChange: setActiveTab,
    chatLabel: unread ? `Chat (${unread})` : "Chat",
    chat: (
      <SharedChatPanel
        compact
        layout="mobile-drawer"
        messages={chatMessages.map((message) => mapChatMessage(message, humanSide))}
        presets={CHAT_PRESET_KEYS.map((id) => ({ id, label: CHAT_PRESETS[id] }))}
        canSend={canSendChat}
        freeTextEnabled={freeTextEnabled}
        freeTextProposalPending={freeTextProposalPending}
        canRequestFreeText={canRequestFreeText}
        maxLength={CHAT_MAX_LENGTH}
        onSendText={sendChatText}
        onRequestFreeText={requestFreeTextChat}
        onSendPreset={(id) => {
          const key = CHAT_PRESET_KEYS.find((key) => key === id);
          if (key) sendChatPreset(key);
        }}
      />
    ),
  };
}
