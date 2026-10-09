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

async function expectOpponentTurnState(pom: CyberpunkSimulatorPom): Promise<void> {
  expectEqual("opponentTurn phase", await pom.getPhase(), "main");
  expectEqual("opponentTurn turn", await pom.getTurnNumber(), 2);
  expectEqual("opponentTurn active player", await pom.getActivePlayerId(), CYBERPUNK_P2);
  expectEqual("opponentTurn game over", await pom.isGameOver(), false);

  await pom.expectBoardMode(CYBERPUNK_P1, "view");
  await pom.expectBoardMode(CYBERPUNK_P2, "select-action");
  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectPendingChoiceType(CYBERPUNK_P2, null);
  // Zone counts are covered by expectStructuralState; the spectator must see
  // the rival's redacted legend as a face-down back.
  await pom.expectFaceDownLegendsCount(CYBERPUNK_P2, 1);
}

describe("opponentTurn fixture behavior", () => {
  test("Observing - opponent's turn in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "opponentTurn" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      await expectOpponentTurnState(pom);

      await pom.takeControl(CYBERPUNK_P2);
      await pom.expectBoardMode(CYBERPUNK_P1, "view");
      await pom.expectBoardMode(CYBERPUNK_P2, "select-action");

      await pom.passPhase(CYBERPUNK_P2);

      expectEqual("phase after P2 passes", await pom.getPhase(), "start");
      expectEqual("active player after P2 passes", await pom.getActivePlayerId(), CYBERPUNK_P1);
      expectEqual("turn after P2 passes", await pom.getTurnNumber(), 3);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "gainGig");
      await pom.expectBoardMode(CYBERPUNK_P1, "select-target");
      await pom.expectBoardMode(CYBERPUNK_P2, "view");

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
