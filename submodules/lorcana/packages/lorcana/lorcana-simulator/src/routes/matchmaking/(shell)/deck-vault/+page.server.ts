import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";
import { serverJsonOrNull } from "$lib/data/server/server-json.js";
import type { MatchmakingContext } from "@/features/matchmaking/api/player-context-api.js";

export const load: PageServerLoad = async ({ request }) => {
  const cookie = request.headers.get("cookie");

  if (!cookie) {
    error(401, "Unauthorized");
  }

  const apiOrigin = getServerApiOrigin(getApiOrigin());

  const matchmakingContext = await serverJsonOrNull<MatchmakingContext>(
    `${apiOrigin}/v1/users/me/games/lorcana/matchmaking-context`,
    { headers: { cookie } },
  );

  if (!matchmakingContext) {
    error(401, "Failed to load matchmaking context");
  }

  const gameProfileId = matchmakingContext.activeGameProfileId;
  if (!gameProfileId) {
    error(400, "No active game profile");
  }

  return {
    gameProfileId,
  };
};
