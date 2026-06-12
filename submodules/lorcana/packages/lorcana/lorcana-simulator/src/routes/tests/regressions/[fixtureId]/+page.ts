import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { resolveRegressionFixtureForTestRoute } from "@/features/simulator-devtools/routes/test-routes.js";

export const ssr = false;

export const load: PageLoad = ({ params }) => {
  const fixture = resolveRegressionFixtureForTestRoute(params.fixtureId);

  if (!fixture) {
    throw error(404, `Regression fixture "${params.fixtureId}" not found`);
  }

  return {
    fixtureId: fixture.id,
  };
};
