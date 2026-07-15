import type { Side } from "./sides";
export {
  CHAT_PRESET_KEYS,
  CHAT_PRESETS,
  MAX_CHAT_TEXT_LENGTH as CHAT_MAX_LENGTH,
  chatMessageText,
  type ChatPresetKey,
} from "@tcg/simulator-runtime/chat";

interface ChatBase {
  id: number;
  timestamp: number;
}

export interface PresetChatMessage extends ChatBase {
  kind: "preset";
  senderSide: Side;
  presetKey: import("@tcg/simulator-runtime/chat").ChatPresetKey;
}

export interface TextChatMessage extends ChatBase {
  kind: "text";
  senderSide: Side;
  text: string;
}

export interface SystemChatMessage extends ChatBase {
  kind: "system";
  text: string;
}

export type ChatMessage = PresetChatMessage | TextChatMessage | SystemChatMessage;
