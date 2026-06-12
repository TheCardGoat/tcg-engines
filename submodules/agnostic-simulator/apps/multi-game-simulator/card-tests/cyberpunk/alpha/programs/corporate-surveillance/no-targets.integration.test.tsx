import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaArmoredMinotaur } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("progCorporateSurveillanceNoTargets fixture behavior", () => {
  test("Corporate Surveillance - no valid targets in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progCorporateSurveillanceNoTargets",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );
      const program = expectDefined(
        "Corporate Surveillance in hand",
        (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
      );

      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      expectEqual(
        "Corporate Surveillance no-target eligible count",
        (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
        0,
      );
      await pom.expectFieldCardSpent(CYBERPUNK_P2, minotaur.instanceId, false);
      await pom.expectHandSize(CYBERPUNK_P1, 0);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P1, 1);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
