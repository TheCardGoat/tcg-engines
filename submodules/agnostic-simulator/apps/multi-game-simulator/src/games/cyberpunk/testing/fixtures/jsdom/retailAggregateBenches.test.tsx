import { describe, test, vi } from "vite-plus/test";
import * as c from "@tcg/cyberpunk-cards";

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

describe("retail aggregate visual benches", () => {
  test("hydrates the Program and target-check bench", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailProgramTargetBench" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      expectEqual("program bench hand size", await pom.getHandSize(CYBERPUNK_P1), 7);
      expectEqual("program bench player field size", await pom.getFieldSize(CYBERPUNK_P1), 3);
      expectEqual("program bench opponent field size", await pom.getFieldSize(CYBERPUNK_P2), 4);

      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailCorporateSurveillance.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailTBugAmateurPhilosopher.id,
      );
      await pom.getCardInZoneByDefinitionId("field", CYBERPUNK_P2, c.alphaArmoredMinotaur.id);
    } finally {
      view.unmount();
    }
  });

  test("hydrates the combat and Gig-pressure bench", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailCombatGigBench" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      expectEqual("combat bench player field size", await pom.getFieldSize(CYBERPUNK_P1), 4);
      expectEqual("combat bench opponent field size", await pom.getFieldSize(CYBERPUNK_P2), 4);
      expectEqual("combat bench player gig count", await pom.getGigCount(CYBERPUNK_P1), 4);
      expectEqual("combat bench opponent gig count", await pom.getGigCount(CYBERPUNK_P2), 3);

      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailJackieWellesRideOrDieChoom.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        c.welcomeToNightCityRetailSecondhandBombus.id,
      );
    } finally {
      view.unmount();
    }
  });

  test("hydrates the Gear and Legend bench", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailGearLegendBench" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      expectEqual("gear bench hand size", await pom.getHandSize(CYBERPUNK_P1), 6);
      expectEqual("gear bench player field size", await pom.getFieldSize(CYBERPUNK_P1), 3);
      expectEqual(
        "gear bench face-down legends",
        await pom.getFaceDownLegendsCount(CYBERPUNK_P1),
        1,
      );

      const placide = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailPlacideVoodooSentinel.id,
      );
      const kiroshi = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailKiroshiOptics.id,
      );
      expectEqual("Kiroshi attached to Placide", kiroshi.attachedToId, placide.instanceId);
      await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailEvelynParkerBeautifulEnigma.id,
      );
    } finally {
      view.unmount();
    }
  });
});
