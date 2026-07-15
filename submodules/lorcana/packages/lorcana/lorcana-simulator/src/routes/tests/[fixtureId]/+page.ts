import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { resolveFixtureForTestRoute } from "@/features/simulator-devtools/routes/test-routes.js";

export const ssr = false;

export const load: PageLoad = ({ params }) => {
  if (!resolveFixtureForTestRoute(params.fixtureId)) {
    throw error(404, `Fixture "${params.fixtureId}" not found`);
  }

  return {
    fixtureId: params.fixtureId,
  };
};
