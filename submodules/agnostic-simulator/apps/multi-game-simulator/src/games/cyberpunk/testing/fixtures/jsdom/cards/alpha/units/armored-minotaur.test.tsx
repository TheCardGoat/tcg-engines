import { describe, test } from "vite-plus/test";
import { alphaArmoredMinotaur, alphaCorpoSecurity } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Armored Minotaur jsdom happy path", () => {
  test("plays at 12+ Street Cred and defeats the selected low-power rival unit", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitArmoredMinotaur" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      await pom.playCardFromHand(alphaArmoredMinotaur);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const corpo = await pom.getCard(alphaCorpoSecurity, { zone: "field", player: CYBERPUNK_P2 });
      await pom.resolveEffectTarget([corpo.instanceId], CYBERPUNK_P1);

      await pom.getCard(alphaArmoredMinotaur, { zone: "field" });
      await pom.getCard(alphaCorpoSecurity, { zone: "trash", player: CYBERPUNK_P2 });
      expectEqual("Armored Minotaur field size", await pom.getFieldSize(CYBERPUNK_P1), 2);
    } finally {
      view.unmount();
    }
  });
});
