import { waitFor } from "@testing-library/react";
import { describe, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailElSombreroNLaVenganzaLenta,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("El Sombreron (Retail) jsdom happy path", () => {
  test("Sketchy Ripper no-Gear deck search auto-resolves in this fixture", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitElSombreronLaVenganzaLentaRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const initialHandSize = await pom.getHandSize(CYBERPUNK_P1);
      const sketchyRipper = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSketchyRipper.id,
      );

      await pom.attackRival(sketchyRipper.instanceId, CYBERPUNK_P1);

      await waitFor(async () => {
        const pendingChoice = await pom.getPendingChoiceType(CYBERPUNK_P1);
        if (pendingChoice !== null) {
          throw new Error(`Expected Sketchy Ripper search to auto-resolve, got ${pendingChoice}.`);
        }
      });
      await pom.expectHandSize(CYBERPUNK_P1, initialHandSize);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Sketchy Ripper's direct attack to continue after search.");
      }
      expectEqual("Sketchy Ripper continued attack kind", attack.kind, "direct");
      expectEqual(
        "Sketchy Ripper continued attack attacker",
        attack.attackerId,
        sketchyRipper.instanceId,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("el Sombreron (Retail) - attack trigger doubles fight power", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitElSombreronLaVenganzaLentaRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const elSombreron = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailElSombreroNLaVenganzaLenta.id,
      );
      const target = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );

      await pom.attackUnit(elSombreron.instanceId, target.instanceId, CYBERPUNK_P1);
      const trigger = (await pom.getPendingTriggerOptions(CYBERPUNK_P1))[0];
      if (!trigger) {
        throw new Error("Expected El Sombreron to offer its optional attack trigger.");
      }
      await pom.resolveTrigger(trigger.triggerId, CYBERPUNK_P1);

      const maxGigs = (await pom.getGigDice(CYBERPUNK_P1)).filter(
        (die) =>
          (die.dieType === "d4" && die.faceValue === 4) ||
          (die.dieType === "d12" && die.faceValue === 12),
      );
      expectEqual("El Sombreron max gig choices", maxGigs.length, 2);
      const d4 = maxGigs.find((die) => die.dieType === "d4");
      if (!d4) {
        throw new Error("Expected D4 to be a selectable max Gig.");
      }
      await pom.resolveEffectTarget([d4.id], CYBERPUNK_P1);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, elSombreron.instanceId, 8);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected El Sombreron to start a fight.");
      }
      expectEqual("El Sombreron attack kind", attack.kind, "fight");
      expectEqual("El Sombreron attack defender", attack.defenderId, target.instanceId);

      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1);

      expectEqual("El Sombreron resolved attack", await pom.getAttackState(), null);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
