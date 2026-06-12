import { describe, test } from "vite-plus/test";
import { alphaTBugAmateurPhilosopher } from "@tcg/cyberpunk-cards";
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

describe("Gorilla Arms (Retail) jsdom happy path", () => {
  test("steals a rival Gig whose value is not shared by a friendly Gig", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearGorillaArmsRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        alphaTBugAmateurPhilosopher.id,
      );
      const firstD4 = expectDefined(
        "Gorilla Arms Retail first rival d4",
        (await pom.getGigDice(CYBERPUNK_P2)).find((die) => die.dieType === "d4"),
      );

      await pom.expectGigCount(CYBERPUNK_P1, 1);
      await pom.expectGigCount(CYBERPUNK_P2, 2);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 8);

      await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1, { gigIdsToSteal: [firstD4.id] });

      expectEqual("Gorilla Arms Retail attack cleared", await pom.getAttackState(), null);
      await pom.expectGigCount(CYBERPUNK_P1, 3);
      await pom.expectGigCount(CYBERPUNK_P2, 0);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
