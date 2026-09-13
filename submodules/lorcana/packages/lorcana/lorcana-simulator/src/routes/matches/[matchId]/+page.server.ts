import { isRedirect, redirect } from "@sveltejs/kit";
import { base } from "$app/paths";
import type { ServerLoadEvent } from "@sveltejs/kit";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";
import { serverJsonOrNull } from "$lib/data/server/server-json.js";

/**
 * /matches/[matchId] — resolves the current game and redirects to
 * /matches/[matchId]/games/[gameId].
 *
 * This is the canonical entry point when you only know the matchId
 * (e.g. rejoining an active match, entering a room where the game
 * already started).
 */
export async function load(event: ServerLoadEvent) {
  const matchId = event.params.matchId as string;

  const generalApi = getServerApiOrigin(getApiOrigin());
  const apiUrl = `${generalApi}/v1/games/lorcana/play/matches/${matchId}`;
  const cookie = event.request.headers.get("cookie") ?? "";

  try {
    const data = await serverJsonOrNull<{ currentGameId?: string }>(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(cookie ? { cookie } : {}),
      },
    });

    if (!data) {
      return { matchId, error: "Match not found or expired." };
    }
    const currentGameId = data.currentGameId;

    if (!currentGameId) {
      return { matchId, error: "Match has no active game." };
    }

    const target = new URL(
      `${base}/matches/${encodeURIComponent(matchId)}/games/${encodeURIComponent(currentGameId)}`,
      event.url.origin,
    );
    const returnTo = event.url.searchParams.get("returnTo");
    if (returnTo) target.searchParams.set("returnTo", returnTo);
    redirect(303, `${target.pathname}${target.search}`);
  } catch (e) {
    if (isRedirect(e)) throw e;
    return { matchId, error: "Failed to connect to the game server." };
  }
}
