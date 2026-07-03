import { LORCANA_REGRESSION_FIXTURES } from "@/features/simulator-devtools/fixtures/regressions";

export const resolveRegressionFixtureForTestRoute = (fixtureId: string) =>
  LORCANA_REGRESSION_FIXTURES[fixtureId];
