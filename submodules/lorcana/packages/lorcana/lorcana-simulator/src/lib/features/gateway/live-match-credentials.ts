import {
  LiveMatchBootstrapV1Schema,
  type LiveMatchBootstrapV1,
  type ResolvedMatchViewer,
  type ScopedRealtimeAccess,
} from "@tcg/game-page-contract";
import type { CredentialsController, GatewayCredentials } from "@tcg/gateway-client";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";

type RefreshRealtimeAccess = () => Promise<ScopedRealtimeAccess>;

/**
 * Keep the shared gateway client's synchronous credential view backed by the
 * latest viewer-scoped access returned by the canonical live-match bootstrap.
 */
export function createLiveMatchCredentialsController(
  initial: ScopedRealtimeAccess,
  refreshRealtimeAccess: RefreshRealtimeAccess,
): CredentialsController {
  let current = initial;

  const snapshot = (): GatewayCredentials => ({
    ticket: current.ticket,
    token: current.reconnectToken,
    expiresAt: Date.parse(current.expiresAt),
    requireAuth: true,
  });

  return {
    get: snapshot,
    refresh: async () => {
      current = await refreshRealtimeAccess();
      return snapshot();
    },
  };
}

/**
 * Re-run the same server-authorized bootstrap used to enter the match. This
 * works for signed-in players/practice matches via their session cookie and
 * for permitted anonymous spectators without trusting an expired scope token.
 */
export async function refreshLiveMatchRealtimeAccess(input: {
  matchId: string;
  gameId: string;
  expectedViewer: ResolvedMatchViewer;
}): Promise<ScopedRealtimeAccess> {
  const matchId = encodeURIComponent(input.matchId);
  const gameId = encodeURIComponent(input.gameId);
  const bootstrap = LiveMatchBootstrapV1Schema.parse(
    await requestJson<unknown>(
      `${getApiOrigin()}/v1/games/lorcana/play/matches/${matchId}/games/${gameId}/context`,
      { method: "GET" },
      "Failed to refresh realtime access",
    ),
  );

  assertSameMatchViewer(bootstrap, input);
  if (!bootstrap.realtime) {
    throw new Error("The live match no longer offers realtime access.");
  }
  return bootstrap.realtime;
}

function assertSameMatchViewer(
  bootstrap: LiveMatchBootstrapV1,
  expected: {
    matchId: string;
    gameId: string;
    expectedViewer: ResolvedMatchViewer;
  },
): void {
  if (bootstrap.match.matchId !== expected.matchId || bootstrap.game.gameId !== expected.gameId) {
    throw new Error("Refreshed realtime access belongs to a different match.");
  }

  const actual = bootstrap.viewer;
  const previous = expected.expectedViewer;
  if (actual.role !== previous.role) {
    throw new Error("Refreshed realtime access changed the viewer role.");
  }

  if (actual.role === "player" && previous.role === "player") {
    if (
      actual.actorId !== previous.actorId ||
      actual.userId !== previous.userId ||
      actual.seat !== previous.seat
    ) {
      throw new Error("Refreshed realtime access changed the player identity.");
    }
    return;
  }

  if (actual.role === "spectator" && previous.role === "spectator") {
    // Anonymous spectator ids are request-local and may rotate. A signed-in
    // spectator must remain bound to the same user across the refresh.
    if (actual.userId !== previous.userId) {
      throw new Error("Refreshed realtime access changed the spectator identity.");
    }
  }
}
