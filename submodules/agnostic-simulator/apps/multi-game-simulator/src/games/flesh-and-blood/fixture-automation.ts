import type { FabTestFixture } from "@tcg/flesh-and-blood-engine/testing";
import type { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import type { FabAutomationPreferences } from "@tcg/flesh-and-blood-engine/simulator";

function visualFixtureProfile(): FabAutomationPreferences {
  return {
    priorityMode: "auto-pass",
    autoOrderTriggers: true,
    autoSelectSingletonTargets: true,
    playAndSkipHoldCardIds: [],
    opponentTriggerYieldCardIds: [],
    instantYieldCardIds: [],
    scopedAutoPass: null,
  };
}

/**
 * Visual fixtures are QA aids, so begin with the same low-friction priority
 * profile on both seats. This is deliberately fixture-only: normal practice
 * matches continue to use each player's saved automation preferences.
 */
export function fabVisualFixtureAutomation(
  player1Id: string,
  player2Id: string,
): NonNullable<FabTestFixture["automation"]> {
  return {
    automationPreferences: {
      [player1Id]: visualFixtureProfile(),
      [player2Id]: visualFixtureProfile(),
    },
  };
}

/**
 * Apply the fixture profile after a scenario has reached its deliberately
 * prepared board state. Seeding it before scenario setup would let priority
 * automation consume the very windows a fixture is intended to show.
 */
export function applyFabVisualFixtureAutomation(
  engine: FabTestEngine,
  player1Id: string,
  player2Id: string,
): void {
  engine.getState().automationPreferences = {
    [player1Id]: visualFixtureProfile(),
    [player2Id]: visualFixtureProfile(),
  };
}
