import { LORCANA_SIMULATOR_FIXTURES } from "@/features/simulator-devtools/fixtures";
import { LORCANA_REGRESSION_FIXTURES } from "@/features/simulator-devtools/fixtures/regressions";

export const buildFixtureTestRouteHref = (fixtureId: string): string => `/tests/${fixtureId}`;
export const buildRegressionFixtureTestRouteHref = (fixtureId: string): string =>
  `/tests/regressions/${fixtureId}`;
export const REGRESSION_FIXTURE_INDEX_ROUTE = "/tests/regressions";

export const resolveFixtureForTestRoute = (fixtureId: string) =>
  LORCANA_SIMULATOR_FIXTURES[fixtureId];

export const resolveRegressionFixtureForTestRoute = (fixtureId: string) =>
  LORCANA_REGRESSION_FIXTURES[fixtureId];
