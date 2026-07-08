import { describe, test } from "vite-plus/test";
import { prm01RebeccaHavingAMoment } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Rebecca - Having a Moment (PRM01) jsdom behavior", () => {
  test("calls as a normal no-text Legend", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendRebeccaHavingAMomentPrm01",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const rebecca = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        prm01RebeccaHavingAMoment.id,
      );
      expectEqual("Rebecca starts face-down", rebecca.faceDown, true);

      await pom.callLegend(rebecca.instanceId, CYBERPUNK_P1);

      const calledRebecca = await pom.getCardInZoneByInstanceId(
        "legendArea",
        CYBERPUNK_P1,
        rebecca.instanceId,
      );
      expectEqual("Rebecca is face-up after call", calledRebecca.faceDown, false);
      await pom.expectEddies(CYBERPUNK_P1, 1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
