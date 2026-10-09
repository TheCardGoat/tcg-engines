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

export function systemChatMessageText(systemEvent: string | undefined): string {
  if (systemEvent?.startsWith("Drop claimed:")) {
    return systemEvent.toLowerCase().includes("timed out")
      ? "Drop approved: opponent timed out."
      : "Drop approved: opponent disconnected.";
  }

  switch (systemEvent) {
    case "undo_proposed":
      return "Undo requested.";
    case "undo_accepted":
      return "Undo request accepted.";
    case "undo_declined":
      return "Undo request rejected.";
    case "undo_expired":
      return "Undo request expired.";
    case "free_text_chat_enabled":
      return "Free text chat enabled.";
    case "enable_free_text_chat_proposed":
      return "Free text chat requested.";
    case "enable_free_text_chat_declined":
      return "Free text chat request rejected.";
    case "enable_free_text_chat_expired":
      return "Free text chat request expired.";
    case "cancel_match_proposed":
      return "Match cancellation requested.";
    case "cancel_match_accepted":
      return "Match cancellation accepted.";
    case "cancel_match_declined":
      return "Match cancellation rejected.";
    case "cancel_match_expired":
      return "Match cancellation request expired.";
    case "enable_manual_mode_proposed":
      return "Manual mode requested.";
    case "enable_manual_mode_accepted":
      return "Manual mode enabled.";
    case "enable_manual_mode_declined":
      return "Manual mode request rejected.";
    case "enable_manual_mode_expired":
      return "Manual mode request expired.";
    case "disable_manual_mode_proposed":
      return "Manual mode disable requested.";
    case "disable_manual_mode_accepted":
      return "Manual mode disabled.";
    case "disable_manual_mode_declined":
      return "Manual mode disable request rejected.";
    case "disable_manual_mode_expired":
      return "Manual mode disable request expired.";
    default:
      return systemEvent ?? "System message.";
  }
}
