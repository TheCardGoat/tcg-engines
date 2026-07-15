export { CHAT_PRESET_KEYS, MAX_CHAT_TEXT_LENGTH, type ChatPresetKey } from "@tcg/protocol/chat";

export const CHAT_PRESETS = {
  good_luck: "Good luck!",
  have_fun: "Have fun!",
  thinking: "Thinking...",
  one_moment: "One moment.",
  nice_play: "Nice play.",
  oops: "Oops.",
  thanks: "Thanks!",
  your_turn: "Your turn.",
  good_game: "GG!",
} as const satisfies Record<import("@tcg/protocol/chat").ChatPresetKey, string>;

export type SimulatorSide = "player" | "opponent";

interface LocalChatBase {
  id: number;
  timestamp: number;
}

export interface LocalPresetChatMessage extends LocalChatBase {
  kind: "preset";
  senderSide: SimulatorSide;
  presetKey: import("@tcg/protocol/chat").ChatPresetKey;
}

export interface LocalTextChatMessage extends LocalChatBase {
  kind: "text";
  senderSide: SimulatorSide;
  text: string;
}

export interface LocalSystemChatMessage extends LocalChatBase {
  kind: "system";
  text: string;
}

export type LocalChatMessage =
  | LocalPresetChatMessage
  | LocalTextChatMessage
  | LocalSystemChatMessage;

export function chatMessageText(message: LocalChatMessage): string {
  if (message.kind === "preset") {
    return CHAT_PRESETS[message.presetKey];
  }
  return message.text;
}
