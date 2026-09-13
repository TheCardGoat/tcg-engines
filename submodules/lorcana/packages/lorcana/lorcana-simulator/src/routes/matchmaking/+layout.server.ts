import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { buildPlatformMatchmakingRedirect } from "$lib/navigation/platform-matchmaking-url.js";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ url }) => {
  throw redirect(308, buildPlatformMatchmakingRedirect(url, env.PUBLIC_PLATFORM_MATCHMAKING_URL));
};
