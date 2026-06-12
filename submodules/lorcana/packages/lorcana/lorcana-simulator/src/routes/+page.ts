import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";
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

export const load: PageLoad = () => {
  if (!dev) {
    throw redirect(302, "/matchmaking");
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
