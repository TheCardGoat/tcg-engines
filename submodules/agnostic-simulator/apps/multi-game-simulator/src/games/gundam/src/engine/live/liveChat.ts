import type { GatewayHandle } from "@tcg/gateway-client";
import { CHAT_PRESETS, type ChatPresetKey } from "@tcg/simulator-runtime/chat";

import type { GundamChatMessage } from "../../game/chat.ts";
import type { LiveGatewayMessage } from "./liveGateway.ts";
import { parseRemoteChatMessages, type RemoteChatMessage } from "./matchContext.ts";

const REMOTE_CHAT_LOG_LIMIT = 200;

/**
 * Live-match chat helpers: gateway emit functions, the free-text policy
 * reducer, and remote→local chat message mapping. Mirrors cyberpunk's
 * `LiveMatch.page.tsx` chat helpers, scoped to gundam's simpler live view
 * (a single controlled seat rather than actor-id side maps).
 */

export interface LiveChatPolicyState {
  freeTextEnabled: boolean;
  freeTextProposalPending: boolean;
}

export function reduceLiveChatPolicy(
  state: LiveChatPolicyState,
  message: LiveGatewayMessage,
): LiveChatPolicyState {
  if (message.type === "game_chat_history") {
    return {
      freeTextEnabled: message.freeTextEnabled === true,
      freeTextProposalPending: state.freeTextProposalPending && message.freeTextEnabled !== true,
    };
  }

  if (message.type === "chat_message" && isFreeTextEnabledSystemChatMessage(message.message)) {
    return { freeTextEnabled: true, freeTextProposalPending: false };
  }

  if (message.type === "proposal_resolved" && message.actionType === "enable_free_text_chat") {
    return {
      freeTextEnabled: state.freeTextEnabled || message.resolution === "accepted",
      freeTextProposalPending: false,
    };
  }

  if (message.type === "proposal_expired" && message.actionType === "enable_free_text_chat") {
    return { ...state, freeTextProposalPending: false };
  }

  if (
    (message.type === "gateway_error" || message.type === "error") &&
    message.code === "free_text_chat_disabled"
  ) {
    return { ...state, freeTextProposalPending: false };
  }

  return state;
}

export function emitGatewayChatPreset(
  handle: Pick<GatewayHandle, "emit"> | null,
  gameId: string,
  presetKey: ChatPresetKey,
): boolean {
  if (!handle || !gameId) {
    return false;
  }
  handle.emit("send_chat_message", { gameId, presetKey });
  return true;
}

export function emitGatewayChatText(
  handle: Pick<GatewayHandle, "emit"> | null,
  gameId: string,
  text: string,
): boolean {
  const trimmed = text.trim();
  if (!handle || !gameId || trimmed.length === 0) {
    return false;
  }
  handle.emit("send_free_text_chat_message", { gameId, text: trimmed });
  return true;
}

/**
 * Free-text approval requests stay a stub until inbox handling exists —
 * same as cyberpunk. The live sidebar therefore hardcodes
 * `canRequestFreeText = false`.
 */
export function emitGatewayFreeTextRequest(
  handle: Pick<GatewayHandle, "emit"> | null,
  gameId: string,
): boolean {
  void handle;
  void gameId;
  return false;
}

export function remoteChatMessagesForViewer(
  messages: readonly RemoteChatMessage[],
  viewerPlayerId: string,
): GundamChatMessage[] {
  return messages
    .map((message) => remoteChatMessageToLocal(message, viewerPlayerId))
    .filter((message): message is GundamChatMessage => message !== null)
    .slice(-REMOTE_CHAT_LOG_LIMIT);
}

export function remoteChatMessageForViewer(
  value: unknown,
  viewerPlayerId: string,
): GundamChatMessage | null {
  const [message] = parseRemoteChatMessages([value]);
  return message ? remoteChatMessageToLocal(message, viewerPlayerId) : null;
}

export function mergeRemoteChatMessage(
  current: GundamChatMessage[],
  message: GundamChatMessage,
): GundamChatMessage[] {
  if (current.some((existing) => existing.id === message.id)) {
    return current;
  }
  return current.concat(message).slice(-REMOTE_CHAT_LOG_LIMIT);
}

export function systemChatMessageText(systemEvent: string | undefined): string {
  switch (systemEvent) {
    case "free_text_chat_enabled":
      return "Free text chat enabled.";
    case "enable_free_text_chat_proposed":
      return "Free text chat requested.";
    case "enable_free_text_chat_declined":
      return "Free text chat request rejected.";
    case "enable_free_text_chat_expired":
      return "Free text chat request expired.";
    default:
      return systemEvent ?? "System message.";
  }
}

function remoteChatMessageToLocal(
  message: RemoteChatMessage,
  viewerPlayerId: string,
): GundamChatMessage | null {
  const id = stableNumericId(message.id);
  const timestamp = Date.parse(message.createdAt);
  const createdAt = Number.isFinite(timestamp) ? timestamp : Date.now();
  if (message.kind === "system") {
    return {
      kind: "system",
      id,
      timestamp: createdAt,
      text: systemChatMessageText(message.systemEvent),
    };
  }

  // Gundam's live view controls exactly one seat; anything not sent by the
  // viewer is attributed to the opponent.
  const senderSide = message.senderPlayerId === viewerPlayerId ? "player" : "opponent";
  if (
    message.kind === "preset" &&
    message.presetKey &&
    Object.prototype.hasOwnProperty.call(CHAT_PRESETS, message.presetKey)
  ) {
    return {
      kind: "preset",
      id,
      timestamp: createdAt,
      senderSide,
      presetKey: message.presetKey,
    };
  }
  if (message.kind === "text" && message.text) {
    return {
      kind: "text",
      id,
      timestamp: createdAt,
      senderSide,
      text: message.text,
    };
  }
  return null;
}

function isFreeTextEnabledSystemChatMessage(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }
  const message = value as { kind?: unknown; systemEvent?: unknown };
  return message.kind === "system" && message.systemEvent === "free_text_chat_enabled";
}

function stableNumericId(value: string): number {
  const numeric = Number(value);
  if (Number.isSafeInteger(numeric) && numeric > 0) {
    return numeric;
  }
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash || 1;
}
