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
  "https://staging.cardgoat.org",
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
  // Mounted deployments (tcg.online, staging, the local docker stack) embed
  // the simulator same-origin behind the reverse proxy, so the deck-builder
  // page posts with our own origin. A same-origin sender already controls
  // this document, so accepting it grants no additional authority.
  if (typeof window !== "undefined" && origin === window.location.origin) {
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
  if (!isCyberpunkDeckImportMessage(event.data)) {
    return { ok: false, reason: "type" };
  }
  if (!isAllowedCardDatabaseOrigin(event.origin)) {
    // A silent drop here stranded the deck builder on "Sending your deck to
    // the simulator…" with no diagnosable signal; surface the rejection
    // without ever answering the untrusted sender.
    console.warn(`[cyberpunk webview] ignored deck import from untrusted origin ${event.origin}`);
    return { ok: false, reason: "origin" };
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
  target?.postMessage(message, origin);
}
