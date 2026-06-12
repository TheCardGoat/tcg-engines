import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("gearZetatechFaceplate fixture behavior", () => {
  test("Zetatech Faceplate - spend trigger adjusts a gig and draws in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearZetatechFaceplate" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const d8 = expectDefined(
        "Zetatech friendly d8",
        (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d8"),
      );

      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectGigValue(d8.id, 3);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);

      await pom.attackRival(host.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Zetatech eligible gig target count", eligible.length, 4);
      if (!eligible.includes(d8.id)) {
        throw new Error("Expected friendly d8 to be an eligible Zetatech Faceplate target.");
      }

      await pom.resolveEffectTarget([d8.id], CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveAdjustGig(4, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectGigValue(d8.id, 4);
      await pom.expectHandSize(CYBERPUNK_P1, 2);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
