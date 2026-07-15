import { describe, test, vi } from "vite-plus/test";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
  type CyberpunkSimulatorPom,
} from "../../cyberpunk-simulator-pom";
import { expectEqual } from "../../fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

async function expectEndGameFixtureState(pom: CyberpunkSimulatorPom): Promise<void> {
  expectEqual("endGame phase", await pom.getPhase(), "main");
  expectEqual("endGame active player", await pom.getActivePlayerId(), CYBERPUNK_P1);
  expectEqual("endGame game over", await pom.isGameOver(), false);

  await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
  await pom.expectBoardMode(CYBERPUNK_P2, "view");
  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectPendingChoiceType(CYBERPUNK_P2, null);

  await pom.expectHandSize(CYBERPUNK_P1, 3);
  await pom.expectFieldSize(CYBERPUNK_P1, 4);
  await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 1);
  await pom.expectFixerDiceCount(CYBERPUNK_P1, 2);
  await pom.expectGigCount(CYBERPUNK_P1, 4);
  await pom.expectEddies(CYBERPUNK_P1, 8);

  await pom.expectFieldSize(CYBERPUNK_P2, 4);
  await pom.expectFaceDownLegendsCount(CYBERPUNK_P2, 0);
  await pom.expectFixerDiceCount(CYBERPUNK_P2, 3);
  await pom.expectGigCount(CYBERPUNK_P2, 3);
  await pom.expectEddies(CYBERPUNK_P2, 7);
}

describe("endGame fixture behavior", () => {
  test("End game - fully revealed in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "endGame" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      await expectEndGameFixtureState(pom);

      await pom.passPhase(CYBERPUNK_P1);

      expectEqual("phase after dense board pass", await pom.getPhase(), "start");
      expectEqual(
        "active player after dense board pass",
        await pom.getActivePlayerId(),
        CYBERPUNK_P2,
      );
      await pom.expectPendingChoiceType(CYBERPUNK_P2, "gainGig");
      await pom.expectBoardMode(CYBERPUNK_P1, "view");
      await pom.expectBoardMode(CYBERPUNK_P2, "select-target");
      expectEqual("game over after dense board pass", await pom.isGameOver(), false);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
