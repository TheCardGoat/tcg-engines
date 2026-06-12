import { describe, test, vi } from "vite-plus/test";
import { alphaFloorIt, alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";

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

function renderOpeningMainPom() {
  ensureJsdomAnimationSupport();
  const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
  const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
  return { pom, unmount: () => view.unmount() };
}

describe("openingMain fixture behavior", () => {
  test("starts with first player in main phase and second player in view mode", async () => {
    const { pom, unmount } = renderOpeningMainPom();
    try {
      expectEqual("openingMain phase", await pom.getPhase(), "main");
      expectEqual("openingMain turn", await pom.getTurnNumber(), 1);
      expectEqual("openingMain active player", await pom.getActivePlayerId(), CYBERPUNK_P1);
      await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
      await pom.expectBoardMode(CYBERPUNK_P2, "view");
      await pom.expectHandSize(CYBERPUNK_P1, 3);
      await pom.expectFieldSize(CYBERPUNK_P1, 2);
      await pom.expectEddies(CYBERPUNK_P1, 5);
    } finally {
      unmount();
    }
  });

  test("first player sells Floor It from hand for one eddie", async () => {
    const { pom, unmount } = renderOpeningMainPom();
    try {
      const floorIt = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaFloorIt.id);

      await pom.sellCard(floorIt.instanceId, CYBERPUNK_P1);

      await pom.expectHandSize(CYBERPUNK_P1, 2);
      await pom.expectEddies(CYBERPUNK_P1, 6);
      await pom.getCardInZoneByDefinitionId("eddieArea", CYBERPUNK_P1, alphaFloorIt.id);
    } finally {
      unmount();
    }
  });

  test("first player sells a card, plays Ruthless Lowlife, then passes the turn", async () => {
    const { pom, unmount } = renderOpeningMainPom();
    try {
      const floorIt = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaFloorIt.id);
      await pom.sellCard(floorIt.instanceId, CYBERPUNK_P1);

      const lowlife = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaRuthlessLowlife.id,
      );
      await pom.playCardFromHand(lowlife.instanceId, CYBERPUNK_P1);

      await pom.expectFieldSize(CYBERPUNK_P1, 3);
      await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P1, alphaRuthlessLowlife.id);
      await pom.expectEddies(CYBERPUNK_P1, 4);

      await pom.passPhase(CYBERPUNK_P1);

      expectEqual("phase after P1 passes", await pom.getPhase(), "start");
      expectEqual("active player after P1 passes", await pom.getActivePlayerId(), CYBERPUNK_P2);
      expectEqual("turn after P1 passes", await pom.getTurnNumber(), 2);
      await pom.expectPendingChoiceType(CYBERPUNK_P2, "gainGig");
      await pom.expectBoardMode(CYBERPUNK_P1, "view");
      await pom.expectBoardMode(CYBERPUNK_P2, "select-target");
    } finally {
      unmount();
    }
  });
});
