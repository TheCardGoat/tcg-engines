import { describe, test } from "vite-plus/test";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Afterparty at Lizzies jsdom happy path", () => {
  test("afterparty at Lizzie's - rival gig to adjust", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progAfterpartyAtLizzies" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const rivalD6 = expectDefined(
        "Afterparty rival d6",
        (await pom.getGigDice(CYBERPUNK_P2)).find((die) => die.dieType === "d6"),
      );
      const program = expectDefined(
        "Afterparty at Lizzie's in hand",
        (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
      );

      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Afterparty eligible gig count", eligible.length, 2);
      if (!eligible.includes(rivalD6.id)) {
        throw new Error("Expected rival d6 to be eligible for Afterparty at Lizzie's.");
      }

      await pom.resolveEffectTarget([rivalD6.id], CYBERPUNK_P1);
      await pom.resolveAdjustGig(2, CYBERPUNK_P1);

      await pom.expectGigValue(rivalD6.id, 2);
      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P1, 1);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
