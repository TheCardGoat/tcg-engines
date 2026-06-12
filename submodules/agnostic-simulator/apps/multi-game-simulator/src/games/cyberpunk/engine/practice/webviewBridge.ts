import {
  createPracticeConfigFromDeckPayload,
  isCyberpunkDeckImportMessage,
  type CyberpunkDeckImportMessage,
  type DeckImportError,
} from "./importedDeck";
import type { StrategyDescriptor } from "../index";

export interface CyberpunkWebviewReadyMessage {
  type: "cyberpunk.webview.ready.v1";
  capabilities: {
    deckImport: true;
    localPractice: true;
    botDeckPayload: true;
    sessionStorage: boolean;
  };
}

export interface CyberpunkDeckImportAcceptedMessage {
  type: "cyberpunk.deck.import.accepted.v1";
  requestId: string;
  matchId: string;
  warnings: string[];
}

export interface CyberpunkDeckImportErrorMessage {
  type: "cyberpunk.deck.import.error.v1";
  requestId: string;
  errors: DeckImportError[];
}

export interface CyberpunkPracticeStartedMessage {
  type: "cyberpunk.practice.started.v1";
  requestId: string;
  matchId: string;
  playerDeckName: string | null;
  botStrategyId: StrategyDescriptor["id"];
}

export interface CyberpunkPracticeEndedMessage {
  type: "cyberpunk.practice.ended.v1";
  matchId: string;
  winner: "player" | "bot" | null;
  reason: string | null;
}

export type CyberpunkWebviewOutboundMessage =
  | CyberpunkWebviewReadyMessage
  | CyberpunkDeckImportAcceptedMessage
  | CyberpunkDeckImportErrorMessage
  | CyberpunkPracticeStartedMessage
  | CyberpunkPracticeEndedMessage;

const PRODUCTION_CARD_DATABASE_ORIGINS = new Set([
  "https://tcg.online",
  "https://cyberpunktcg.com",
  "https://www.cyberpunktcg.com",
  "https://thecardgoat.com",
]);

export function createWebviewReadyMessage(): CyberpunkWebviewReadyMessage {
  return {
    type: "cyberpunk.webview.ready.v1",
    capabilities: {
      deckImport: true,
      localPractice: true,
      botDeckPayload: true,
      sessionStorage: typeof window !== "undefined" && Boolean(window.sessionStorage),
    },
  };
}

export function isAllowedCardDatabaseOrigin(origin: string): boolean {
  if (PRODUCTION_CARD_DATABASE_ORIGINS.has(origin)) {
    return true;
  }
  if (!import.meta.env.DEV) {
    return false;
  }
  try {
    const url = new URL(origin);
    return (
      url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

export function parseDeckImportMessage(
  event: MessageEvent,
): { ok: true; message: CyberpunkDeckImportMessage } | { ok: false; reason: "origin" | "type" } {
  if (!isAllowedCardDatabaseOrigin(event.origin)) {
    return { ok: false, reason: "origin" };
  }
  if (!isCyberpunkDeckImportMessage(event.data)) {
    return { ok: false, reason: "type" };
  }
  return { ok: true, message: event.data };
}

export function resolveDeckImportMessage(message: CyberpunkDeckImportMessage) {
  return createPracticeConfigFromDeckPayload(message.payload);
}

export function postWebviewMessage(
  target: Window | null | undefined,
  origin: string,
  message: CyberpunkWebviewOutboundMessage,
): void {
  console.log({ target, origin, message });
  target?.postMessage(message, origin);
}
