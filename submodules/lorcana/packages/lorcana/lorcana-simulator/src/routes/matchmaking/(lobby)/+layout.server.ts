import type { ServerLoadEvent } from "@sveltejs/kit";
import { loadMatchmakingData } from "$lib/features/matchmaking/server/load-matchmaking-data.js";

export async function load({ request }: ServerLoadEvent) {
  return loadMatchmakingData(request);
}
