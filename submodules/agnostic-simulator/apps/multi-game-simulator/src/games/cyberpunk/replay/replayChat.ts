import type { ReplayChatMessage } from "@tcg/game-page-contract";
import { P1, P2 } from "@tcg/cyberpunk-engine";
import {
  CHAT_PRESETS,
  systemChatMessageText,
  type ChatPresetKey,
} from "@tcg/simulator-runtime/chat";

import type { ChatMessage } from "../engine/chat";
import type { Side } from "../engine/sides";

/** Map persisted replay chat into the board feed, using the same seats as the projected board. */
export function replayChatMessagesForBoard(
  messages: readonly ReplayChatMessage[],
  playerIds: readonly [string, string],
): ChatMessage[] {
  return messages.flatMap((message) => {
    const local = toLocalChatMessage(message, playerIds);
    return local ? [local] : [];
  });
}

function toLocalChatMessage(
  message: ReplayChatMessage,
  playerIds: readonly [string, string],
): ChatMessage | null {
  const id = stableNumericId(message.id);
  if (message.kind === "system") {
    return {
      kind: "system",
      id,
      timestamp: message.timestamp,
      text: systemChatMessageText(message.systemEvent ?? message.text),
    };
  }

  const senderSide = sideForReplayChat(message, playerIds);
  if (!senderSide) return null;
  if (
    message.kind === "preset" &&
    message.presetKey &&
    Object.prototype.hasOwnProperty.call(CHAT_PRESETS, message.presetKey)
  ) {
    return {
      kind: "preset",
      id,
      timestamp: message.timestamp,
      senderSide,
      presetKey: message.presetKey as ChatPresetKey,
    };
  }
  if (message.kind === "text" && message.text) {
    return {
      kind: "text",
      id,
      timestamp: message.timestamp,
      senderSide,
      text: message.text,
    };
  }
  return null;
}

function sideForReplayChat(
  message: ReplayChatMessage,
  playerIds: readonly [string, string],
): Side | null {
  if (message.senderPlayerId === playerIds[0] || message.senderPlayerId === String(P1)) {
    return "player";
  }
  if (message.senderPlayerId === playerIds[1] || message.senderPlayerId === String(P2)) {
    return "opponent";
  }
  if (message.senderSeat === 1) return "player";
  if (message.senderSeat === 2) return "opponent";
  return null;
}

function stableNumericId(value: string): number {
  const numeric = Number(value);
  if (Number.isSafeInteger(numeric) && numeric > 0) return numeric;
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash || 1;
}
