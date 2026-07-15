import {
  LORCANA_SIMULATOR_FIXTURE_MANIFEST_BY_ID,
  loadLorcanaFixture,
} from "@/features/simulator-devtools/fixtures";

export const buildFixtureTestRouteHref = (fixtureId: string): string => `/tests/${fixtureId}`;
export const buildRegressionFixtureTestRouteHref = (fixtureId: string): string =>
  `/tests/regressions/${fixtureId}`;
export const REGRESSION_FIXTURE_INDEX_ROUTE = "/tests/regressions";

export const resolveFixtureForTestRoute = (fixtureId: string) =>
  LORCANA_SIMULATOR_FIXTURE_MANIFEST_BY_ID[fixtureId];

export const loadFixtureForTestRoute = (fixtureId: string) => loadLorcanaFixture(fixtureId);
