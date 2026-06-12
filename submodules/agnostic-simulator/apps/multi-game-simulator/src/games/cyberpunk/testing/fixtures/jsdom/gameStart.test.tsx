import { describe, test, vi } from "vite-plus/test";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../cyberpunk-simulator-pom";
import { expectEqual } from "../../fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

function renderGameStartPom() {
  ensureJsdomAnimationSupport();
  const view = renderCyberpunkSimulatorScenario({ scenarioId: "gameStart" });
  const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
  return { pom, unmount: () => view.unmount() };
}

describe("gameStart fixture behavior", () => {
  test("starts both players in setup with six cards, private legends, fixer dice, and no gigs", async () => {
    const { pom, unmount } = renderGameStartPom();
    try {
      expectEqual("initial phase", await pom.getPhase(), "setup");

      for (const player of [CYBERPUNK_P1, CYBERPUNK_P2]) {
        await pom.expectHandSize(player, 6);
        await pom.expectFaceDownLegendsCount(player, 3);
        await pom.expectFixerDiceCount(player, 6);
        await pom.expectGigCount(player, 0);
        expectEqual("setup eddies", await pom.getEddies(player), 0);
      }
    } finally {
      unmount();
    }
  });

  test("first player mulligans their hand and the game stays in setup for the second player", async () => {
    const { pom, unmount } = renderGameStartPom();
    try {
      const first = await pom.getActivePlayerId();

      await pom.clearDispatchLog();
      await pom.mulligan(first);

      await pom.expectLastDispatch({ type: "mulligan", as: first });
      await pom.expectHandSize(first, 6);
      expectEqual("phase after first mulligan", await pom.getPhase(), "setup");
    } finally {
      unmount();
    }
  });

  test("second player keeps their hand and the game advances to the start phase", async () => {
    const { pom, unmount } = renderGameStartPom();
    try {
      const first = await pom.getActivePlayerId();
      const second = await pom.getOpponentOf(first);

      await pom.mulligan(first);
      await pom.clearDispatchLog();
      await pom.keepHand(second);

      await pom.expectLastDispatch({ type: "keepHand", as: second });
      expectEqual("phase after setup choices", await pom.getPhase(), "start");
      await pom.expectHandSize(first, 7);
      await pom.expectHandSize(second, 6);
      await pom.expectFaceDownLegendsCount(first, 3);
      await pom.expectFaceDownLegendsCount(second, 3);
    } finally {
      unmount();
    }
  });
});
