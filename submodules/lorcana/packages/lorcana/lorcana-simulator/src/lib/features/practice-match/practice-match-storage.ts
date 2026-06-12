import type { PracticeMatchSession } from "./types.js";
import { authSession } from "$lib/auth/session.svelte.js";

const STORAGE_KEY = "lorcana.simulator.practiceMatch.session";

function pickString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/** Normalize localStorage JSON (supports legacy `playerId` → `gameProfileId`). */
function normalizeStoredSession(
  raw: Record<string, unknown>,
  expectedGameId: string,
): PracticeMatchSession | null {
  const gid = pickString(raw.gameId);
  if (gid !== expectedGameId) return null;

  const gameProfileId = pickString(raw.gameProfileId) ?? pickString(raw.playerId);
  if (!gameProfileId) return null;

  const matchId = pickString(raw.matchId);
  if (!matchId) return null;

  const botPlayerId = typeof raw.botPlayerId === "string" ? raw.botPlayerId : "";
  const rawDeck = raw.deckConfig;
  if (rawDeck == null || typeof rawDeck !== "object" || Array.isArray(rawDeck)) {
    return null;
  }
  const deckConfig = rawDeck as PracticeMatchSession["deckConfig"];

  const userId = pickString(raw.userId);
  const wsTicket = pickString(raw.wsTicket);

  const session: PracticeMatchSession = {
    matchId,
    gameId: gid,
    gameProfileId,
    botPlayerId,
    deckConfig,
  };
  if (userId) session.userId = userId;
  if (wsTicket) session.wsTicket = wsTicket;
  return session;
}

export function savePracticeSession(session: PracticeMatchSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function loadPracticeSession(gameId: string): PracticeMatchSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;
    return normalizeStoredSession(parsed as Record<string, unknown>, gameId);
  } catch {
    return null;
  }
}

export function clearPracticeSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently ignore
  }
}

/**
 * Save a minimal session for ranked matches so `/match/[gameId]` can
 * identify the player and connect via the gateway ticket flow.
 * Reuses the same storage key and shape as practice sessions.
 */
export function saveRankedMatchSession(params: {
  matchId: string;
  gameId: string;
  gameProfileId: string;
  userId?: string;
}): void {
  const userId = params.userId ?? authSession.user?.id;
  const session: PracticeMatchSession = {
    matchId: params.matchId,
    gameId: params.gameId,
    gameProfileId: params.gameProfileId,
    botPlayerId: "",
    deckConfig: {} as PracticeMatchSession["deckConfig"],
  };
  if (userId) session.userId = userId;
  savePracticeSession(session);
}
