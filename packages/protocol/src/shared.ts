export const CHAT_PRESET_KEYS = [
  "good_luck",
  "have_fun",
  "thinking",
  "one_moment",
  "nice_play",
  "oops",
  "thanks",
  "good_game",
] as const;

export type ChatPresetKey = (typeof CHAT_PRESET_KEYS)[number];
export type ChatMessageKind = "preset" | "text" | "system";
export const MAX_CHAT_TEXT_LENGTH = 280;

export interface BaseChatMessage {
  id: string;
  matchId: string;
  gameId: string;
  senderPlayerId: string;
  senderSeat: 0 | 1 | 2;
  kind: ChatMessageKind;
  createdAt: string;
  expiresAt: string;
}

export interface PresetChatMessage extends BaseChatMessage {
  kind: "preset";
  presetKey: ChatPresetKey;
}

export interface TextChatMessage extends BaseChatMessage {
  kind: "text";
  text: string;
}

export interface SystemChatMessage extends Omit<BaseChatMessage, "senderSeat"> {
  kind: "system";
  senderSeat: 0;
  systemEvent: string;
  systemData?: Record<string, unknown>;
}

export type ChatMessage = PresetChatMessage | TextChatMessage | SystemChatMessage;

export type PlayableGameSlug = "lorcana" | "gundam" | "cyberpunk" | "riftbound" | "one-piece";

export const PLAYABLE_GAME_SLUGS = [
  "lorcana",
  "gundam",
  "cyberpunk",
  "riftbound",
  "one-piece",
] as const satisfies readonly PlayableGameSlug[];

export function isPlayableGameSlug(value: unknown): value is PlayableGameSlug {
  return typeof value === "string" && (PLAYABLE_GAME_SLUGS as readonly string[]).includes(value);
}
