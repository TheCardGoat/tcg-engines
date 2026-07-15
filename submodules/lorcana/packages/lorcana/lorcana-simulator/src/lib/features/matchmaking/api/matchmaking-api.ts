import { getApiOrigin } from "$lib/config/public-url-config.js";
import { HttpRequestError, requestJson, requestVoid } from "$lib/data/transport/http-client.js";

export interface MatchmakingJoinParams {
  gameProfileId: string;
  format: string;
  mode: string;
  /** Bitmask of opponent ink colors the player wants to face (casual only, ≤2 bits). */
  preferredOpponentColors?: number;
  /** Bitmask of opponent ink colors the player wants to avoid (casual only, ≤2 bits). */
  excludedOpponentColors?: number;
  /** Whether color preferences are hard requirements or soft suggestions relaxed after 60 s. */
  colorPreferenceStrength?: "required" | "preferred";
  bracketId?: string;
  /**
   * Queue match type:
   * - "ranked" (default)
   * - "casual" (quick match)
   * - "testing" (dev-only; backend rejects in production)
   */
  matchType?: "ranked" | "casual" | "testing";
  /** Whether the player is on a mobile device (detected client-side via User-Agent). */
  isMobile?: boolean;
}

export interface MatchmakingEntryResponse {
  object: "matchmaking_entry";
  status: "queued";
  queuedAt: number;
  expiresAt: number;
}

export interface MatchmakingStatusResponse {
  object: "matchmaking_status";
  queued: boolean;
  entry?: {
    userId: string;
    gameProfileId: string;
    deckListId: string;
    format: string;
    mode: string;
    bracketId?: string;
    matchType?: string;
    queuedAt: number;
    expiresAt: number;
  };
  position?: number;
  /** Present when the player is in the pending-acceptance phase (dequeued until accept/decline/timeout). */
  pendingMatchId?: string;
  pendingMatchDeadline?: number;
  /** Server timestamp captured with pendingMatchDeadline for client clock-skew correction. */
  pendingMatchServerNow?: number;
  pendingSelfAccepted?: boolean;
  pendingOpponentAccepted?: boolean;
}

export interface RejoinMatchDetailsResponse {
  currentGameId?: string;
  participants?: Array<{ id: string; userId?: string }>;
}

export class MatchmakingJoinError extends Error {
  public readonly matchId?: string;

  constructor(message: string, matchId?: string) {
    super(message);
    this.name = "MatchmakingJoinError";
    this.matchId = matchId;
  }
}

export async function joinMatchmakingQueue(
  params: MatchmakingJoinParams,
): Promise<MatchmakingEntryResponse> {
  try {
    return await requestJson<MatchmakingEntryResponse>(
      `${getApiOrigin()}/v1/games/lorcana/play/matchmaking/join`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      },
      "Failed to join queue",
    );
  } catch (error) {
    if (error instanceof HttpRequestError) {
      const payload =
        typeof error.payload === "object" && error.payload !== null
          ? (error.payload as Record<string, unknown>)
          : null;
      const matchId = payload && typeof payload.matchId === "string" ? payload.matchId : undefined;
      throw new MatchmakingJoinError(error.message, matchId);
    }

    throw error;
  }
}

export async function leaveMatchmakingQueue(): Promise<void> {
  await requestVoid(
    `${getApiOrigin()}/v1/games/lorcana/play/matchmaking/leave`,
    {
      method: "DELETE",
    },
    "Failed to leave queue",
  );
}

export async function forfeitMatch(matchId: string): Promise<void> {
  await requestVoid(
    `${getApiOrigin()}/v1/games/lorcana/play/matchmaking/forfeit-match`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId }),
    },
    "Failed to forfeit match",
  );
}

export async function fetchRejoinMatchDetails(
  matchId: string,
): Promise<RejoinMatchDetailsResponse | null> {
  try {
    return await requestJson<RejoinMatchDetailsResponse>(
      `${getApiOrigin()}/v1/games/lorcana/play/matches/${matchId}`,
      undefined,
      "Could not load match details. Please try again.",
    );
  } catch (error) {
    if (error instanceof HttpRequestError) {
      return null;
    }
    throw error;
  }
}

export async function getMatchmakingStatus(): Promise<MatchmakingStatusResponse> {
  return requestJson<MatchmakingStatusResponse>(
    `${getApiOrigin()}/v1/games/lorcana/play/matchmaking/status`,
    undefined,
    "Failed to get matchmaking status",
  );
}
