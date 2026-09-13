import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { buildPlatformMatchmakingRedirect } from "$lib/navigation/platform-matchmaking-url.js";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
  throw redirect(302, buildPlatformMatchmakingRedirect(url, env.PUBLIC_PLATFORM_MATCHMAKING_URL));
};
