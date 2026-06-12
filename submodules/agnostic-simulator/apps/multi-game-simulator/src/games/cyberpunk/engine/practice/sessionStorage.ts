import {
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  getAutomatedActionStrategyOption,
} from "@tcg/cyberpunk-engine";
import type { StrategyDescriptor } from "../index";
import type { DeckList } from "@tcg/cyberpunk-engine";
import { DEFAULT_BOT_PRACTICE_DECK_ID, DEFAULT_PLAYER_PRACTICE_DECK_ID } from "./deckFixtures";

export const PRACTICE_SESSION_STORAGE_KEY = "cyberpunk.simulator.practiceMatch.sessions";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface PracticeMatchConfig {
  matchId: string;
  source: "fixture" | "card-db";
  playerDeckFixtureId?: string;
  botDeckFixtureId?: string;
  playerDeck?: DeckList;
  botDeck?: DeckList;
  playerDeckName?: string;
  botStrategyId: StrategyDescriptor["id"];
  seed: string;
  createdAt: number;
}

type StoredSessions = Record<string, PracticeMatchConfig>;

export function createPracticeMatchConfig(
  input: Partial<
    Pick<PracticeMatchConfig, "playerDeckFixtureId" | "botDeckFixtureId" | "botStrategyId">
  > = {},
): PracticeMatchConfig {
  const matchId = `practice_${Date.now().toString(36)}_${randomToken()}`;
  return {
    matchId,
    source: "fixture",
    playerDeckFixtureId: input.playerDeckFixtureId ?? DEFAULT_PLAYER_PRACTICE_DECK_ID,
    botDeckFixtureId: input.botDeckFixtureId ?? DEFAULT_BOT_PRACTICE_DECK_ID,
    botStrategyId: input.botStrategyId ?? DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    seed: `practice:${matchId}`,
    createdAt: Date.now(),
  };
}

export function createImportedPracticeMatchConfig(input: {
  playerDeck: DeckList;
  botDeck?: DeckList;
  botDeckFixtureId?: string;
  botStrategyId?: StrategyDescriptor["id"];
  seed?: string;
  deckName?: string;
}): PracticeMatchConfig {
  const matchId = `practice_${Date.now().toString(36)}_${randomToken()}`;
  return {
    matchId,
    source: "card-db",
    playerDeck: input.playerDeck,
    botDeck: input.botDeck,
    botDeckFixtureId: input.botDeck
      ? undefined
      : (input.botDeckFixtureId ?? DEFAULT_BOT_PRACTICE_DECK_ID),
    playerDeckName: input.deckName,
    botStrategyId: input.botStrategyId ?? DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    seed: input.seed ?? `practice:${matchId}`,
    createdAt: Date.now(),
  };
}

export function savePracticeMatchConfig(config: PracticeMatchConfig): void {
  if (!hasSessionStorage()) {
    throw new Error("Practice matches require browser session storage.");
  }
  const sessions = readSessions();
  sessions[config.matchId] = config;
  window.sessionStorage.setItem(PRACTICE_SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

export function loadPracticeMatchConfig(matchId: string): PracticeMatchConfig | null {
  if (!hasSessionStorage()) {
    return null;
  }
  const sessions = readSessions();
  const config = sessions[matchId];
  if (!isPracticeMatchConfig(config)) {
    return null;
  }
  if (Date.now() - config.createdAt > SESSION_TTL_MS) {
    delete sessions[matchId];
    window.sessionStorage.setItem(PRACTICE_SESSION_STORAGE_KEY, JSON.stringify(sessions));
    return null;
  }
  return config;
}

export function clearPracticeMatchSessions(): void {
  if (hasSessionStorage()) {
    window.sessionStorage.removeItem(PRACTICE_SESSION_STORAGE_KEY);
  }
}

function readSessions(): StoredSessions {
  try {
    const raw = window.sessionStorage.getItem(PRACTICE_SESSION_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const sessions: StoredSessions = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (isPracticeMatchConfig(value)) {
        sessions[key] = value;
      }
    }
    return sessions;
  } catch {
    return {};
  }
}

function isPracticeMatchConfig(value: unknown): value is PracticeMatchConfig {
  if (!value || typeof value !== "object") {
    return false;
  }
  const maybe = value as Partial<PracticeMatchConfig>;
  return (
    typeof maybe.matchId === "string" &&
    (maybe.source === "fixture" || maybe.source === "card-db" || maybe.source === undefined) &&
    hasPlayerDeckSource(maybe) &&
    hasBotDeckSource(maybe) &&
    isStoredStrategyId(maybe.botStrategyId) &&
    typeof maybe.seed === "string" &&
    typeof maybe.createdAt === "number"
  );
}

function isStoredStrategyId(value: unknown): value is StrategyDescriptor["id"] {
  return typeof value === "string" && Boolean(getAutomatedActionStrategyOption(value));
}

function hasPlayerDeckSource(config: Partial<PracticeMatchConfig>): boolean {
  if (config.source === "card-db") {
    return isDeckList(config.playerDeck);
  }
  return typeof config.playerDeckFixtureId === "string";
}

function hasBotDeckSource(config: Partial<PracticeMatchConfig>): boolean {
  if (config.botDeck) {
    return isDeckList(config.botDeck);
  }
  return typeof config.botDeckFixtureId === "string";
}

function isDeckList(value: unknown): value is DeckList {
  if (!value || typeof value !== "object") {
    return false;
  }
  const maybe = value as Partial<DeckList>;
  return (
    typeof maybe.playerId === "string" &&
    typeof maybe.playerName === "string" &&
    Array.isArray(maybe.legends) &&
    maybe.legends.every((id) => typeof id === "string") &&
    Array.isArray(maybe.mainDeck) &&
    maybe.mainDeck.every((id) => typeof id === "string")
  );
}

function randomToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

function hasSessionStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}
