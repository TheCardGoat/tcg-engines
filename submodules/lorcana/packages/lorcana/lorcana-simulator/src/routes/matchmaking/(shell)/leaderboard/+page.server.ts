import type { PageServerLoad } from "./$types";
import { loadLeaderboardPageData } from "$lib/features/matchmaking/server/leaderboard-page-data.js";

export const load: PageServerLoad = async ({ request, url }) => {
  return loadLeaderboardPageData({
    url,
    cookie: request.headers.get("cookie"),
  });
};
