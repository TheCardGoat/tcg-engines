export {
  CHAT_PRESET_KEYS,
  CHAT_PRESETS,
  MAX_CHAT_TEXT_LENGTH as CHAT_MAX_LENGTH,
  chatMessageText,
  type ChatPresetKey,
} from "@tcg/simulator-runtime/chat";

/**
 * Side a chat message is attributed to, relative to the viewer:
 * `"player"` is the local seat, `"opponent"` the remote seat.
 * Mirrors cyberpunk's engine/chat.ts union.
 */
export type ChatSenderSide = "player" | "opponent";

interface ChatBase {
  id: number;
  timestamp: number;
}

export interface PresetChatMessage extends ChatBase {
  kind: "preset";
  senderSide: ChatSenderSide;
  presetKey: import("@tcg/simulator-runtime/chat").ChatPresetKey;
}

export interface TextChatMessage extends ChatBase {
  kind: "text";
  senderSide: ChatSenderSide;
  text: string;
}

export interface SystemChatMessage extends ChatBase {
  kind: "system";
  text: string;
}

export type GundamChatMessage = PresetChatMessage | TextChatMessage | SystemChatMessage;
