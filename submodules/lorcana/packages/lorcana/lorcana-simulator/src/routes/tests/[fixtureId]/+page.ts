import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { resolveFixtureForTestRoute } from "@/features/simulator-devtools/routes/test-routes.js";

export const ssr = false;

export const load: PageLoad = ({ params }) => {
  const fixture = resolveFixtureForTestRoute(params.fixtureId);

  if (!fixture) {
    throw error(404, `Fixture "${params.fixtureId}" not found`);
  }

  return {
    fixtureId: fixture.id,
  };
};
