import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import type { LorcanaSimulatorFixture } from "@/features/simulator/model/contracts.js";
import { getLorcanaRegressionFixture } from "@/features/simulator-devtools/fixtures/regressions/index.js";

type RegressionEngineOverrides = Partial<
  NonNullable<Parameters<typeof LorcanaMultiplayerTestEngine.createWithFixture>[2]>
>;

export function createRegressionTestEngine(
  fixtureOrId: string | LorcanaSimulatorFixture,
  overrides: RegressionEngineOverrides = {},
): LorcanaMultiplayerTestEngine {
  const fixture =
    typeof fixtureOrId === "string" ? getLorcanaRegressionFixture(fixtureOrId) : fixtureOrId;

  return LorcanaMultiplayerTestEngine.createWithFixture(fixture.playerOne, fixture.playerTwo, {
    seed: fixture.seed ?? `regression-${fixture.id}`,
    skipPreGame: fixture.skipPreGame ?? true,
    ...overrides,
  });
}
