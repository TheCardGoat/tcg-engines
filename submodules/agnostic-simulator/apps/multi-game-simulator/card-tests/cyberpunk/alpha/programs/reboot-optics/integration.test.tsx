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

describe("progRebootOptics fixture behavior", () => {
  test("Reboot Optics - friendly units on field in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progRebootOptics" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const target = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaSwordwiseHuscle.id,
      );
      const program = expectDefined(
        "Reboot Optics in hand",
        (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
      );

      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Reboot Optics eligible target count", eligible.length, 2);
      if (!eligible.includes(target.instanceId)) {
        throw new Error("Expected Swordwise Huscle to be eligible for Reboot Optics.");
      }

      await pom.resolveEffectTarget([target.instanceId], CYBERPUNK_P1);

      await pom.expectRenderedFieldCardPower(CYBERPUNK_P1, target.instanceId, 9);
      await pom.expectHandSize(CYBERPUNK_P1, 0);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P1, 1);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
