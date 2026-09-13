import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import { redirect } from "@sveltejs/kit";
import { buildPlatformMatchmakingRedirect } from "$lib/navigation/platform-matchmaking-url.js";
import type { PageLoad } from "./$types";
import {
  generalFixtureRouteLinks,
  regressionFixtureCount,
  regressionRouteLink,
  routePatterns,
  staticRouteLinks,
  visualValidationRouteLinks,
} from "@/features/simulator-devtools/routes/dev-routes.js";

export const ssr = false;

export const load: PageLoad = ({ url }) => {
  if (!dev) {
    throw redirect(302, buildPlatformMatchmakingRedirect(url, env.PUBLIC_PLATFORM_MATCHMAKING_URL));
  }

  return {
    generalFixtureRouteLinks,
    regressionFixtureCount,
    regressionRouteLink,
    routePatterns,
    staticRouteLinks,
    visualValidationRouteLinks,
  };
};
