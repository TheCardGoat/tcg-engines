import { getContext, hasContext, setContext } from "svelte";
import {
  CHAT_PRESET_KEYS,
  MAX_CHAT_TEXT_LENGTH,
  type ChatMessage,
  type ChatPresetKey,
} from "@tcg/shared";

const MATCH_CHAT_CONTEXT_KEY = Symbol.for("lorcana.match-chat");

export type MatchChatOutboundMessage =
  | {
      type: "send_chat_message";
      gameId: string;
      presetKey: ChatPresetKey;
    }
  | {
      type: "send_free_text_chat_message";
      gameId: string;
      text: string;
    }
  | {
      type: "proposal_send";
      gameId: string;
      actionType: "enable_free_text_chat";
    };

export interface MatchChatControllerOptions {
  gameId: string;
  canSend: boolean;
  sendMessage: (message: MatchChatOutboundMessage) => void;
}

function compareMessages(left: ChatMessage, right: ChatMessage): number {
  const timestampDiff = Date.parse(left.createdAt) - Date.parse(right.createdAt);
  if (timestampDiff !== 0) {
    return timestampDiff;
  }

  return left.id.localeCompare(right.id);
}

function mergeMessages(
  existing: readonly ChatMessage[],
  incoming: readonly ChatMessage[],
): ChatMessage[] {
  const byId = new Map<string, ChatMessage>();
  for (const message of existing) {
    byId.set(message.id, message);
  }
  for (const message of incoming) {
    byId.set(message.id, message);
  }

  return [...byId.values()].sort(compareMessages);
}

function historyContainsFreeTextEnabled(messages: readonly ChatMessage[]): boolean {
  return messages.some(
    (msg) => msg.kind === "system" && msg.systemEvent === "free_text_chat_enabled",
  );
}

export class MatchChatController {
  readonly gameId: string;
  readonly canSend: boolean;
  readonly presetKeys = CHAT_PRESET_KEYS;
  readonly maxTextLength = MAX_CHAT_TEXT_LENGTH;

  matchId: string | null = $state(null);
  messages: ChatMessage[] = $state([]);
  freeTextEnabled = $state(false);
  freeTextProposalPending = $state(false);

  readonly #sendMessage: MatchChatControllerOptions["sendMessage"];

  constructor(options: MatchChatControllerOptions) {
    this.gameId = options.gameId;
    this.canSend = options.canSend;
    this.#sendMessage = options.sendMessage;
  }

  hydrateHistory(
    matchId: string,
    messages: readonly ChatMessage[],
    options?: { freeTextEnabled?: boolean },
  ): void {
    this.matchId = matchId;
    this.messages = mergeMessages([], messages);
    this.freeTextEnabled =
      options?.freeTextEnabled === true || historyContainsFreeTextEnabled(messages);
    this.freeTextProposalPending = false;
  }

  receiveMessage(matchId: string, message: ChatMessage): void {
    this.matchId = matchId;
    this.messages = mergeMessages(this.messages, [message]);
    if (message.kind === "system" && message.systemEvent === "free_text_chat_enabled") {
      this.freeTextEnabled = true;
      this.freeTextProposalPending = false;
    }
  }

  /**
   * Called when a proposal with actionType "enable_free_text_chat" is resolved
   * (accepted, declined, expired, failed). Clears the local pending flag.
   */
  clearFreeTextProposalPending(): void {
    this.freeTextProposalPending = false;
  }

  sendPreset(presetKey: ChatPresetKey): void {
    if (!this.canSend) {
      return;
    }

    this.#sendMessage({
      type: "send_chat_message",
      gameId: this.gameId,
      presetKey,
    });
  }

  sendText(text: string): void {
    if (!this.canSend || !this.freeTextEnabled) {
      return;
    }

    const normalized = text.trim();
    if (normalized.length === 0 || normalized.length > MAX_CHAT_TEXT_LENGTH) {
      return;
    }
    if (/[\r\n]/.test(normalized)) {
      return;
    }

    this.#sendMessage({
      type: "send_free_text_chat_message",
      gameId: this.gameId,
      text: normalized,
    });
  }

  proposeEnableFreeText(): void {
    if (!this.canSend || this.freeTextEnabled || this.freeTextProposalPending) {
      return;
    }

    this.freeTextProposalPending = true;
    this.#sendMessage({
      type: "proposal_send",
      gameId: this.gameId,
      actionType: "enable_free_text_chat",
    });
  }
}

export class MatchChatControllerContextValue {
  controller: MatchChatController | null = $state(null);

  constructor(controller: MatchChatController | null) {
    this.controller = controller;
  }
}

export function setMatchChatController(
  controller: MatchChatController | null,
): MatchChatControllerContextValue {
  if (hasContext(MATCH_CHAT_CONTEXT_KEY)) {
    const existingContext = getContext<MatchChatControllerContextValue>(MATCH_CHAT_CONTEXT_KEY);
    existingContext.controller = controller;
    return existingContext;
  }

  const context = new MatchChatControllerContextValue(controller);
  return setContext(MATCH_CHAT_CONTEXT_KEY, context);
}

export function maybeUseMatchChatControllerContext(): MatchChatControllerContextValue | null {
  if (!hasContext(MATCH_CHAT_CONTEXT_KEY)) {
    return null;
  }

  return getContext<MatchChatControllerContextValue>(MATCH_CHAT_CONTEXT_KEY);
}

export function maybeUseMatchChatController(): MatchChatController | null {
  return maybeUseMatchChatControllerContext()?.controller ?? null;
}
