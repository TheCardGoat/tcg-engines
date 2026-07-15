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
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        c.embracingPowerRetailStarterDeckMinotaur.id,
      );
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

  test("drives Modded Kusanagi direct attack into stolen-Gig resolution", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailGearLegendBench" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const kusanagi = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailModdedKusanagi.id,
      );
      const rivalGigsBeforeAttack = await pom.getGigDice(CYBERPUNK_P2);
      expectEqual("gear bench rival Gigs before attack", rivalGigsBeforeAttack.length, 2);

      await pom.attackRival(kusanagi.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Modded Kusanagi direct attack to be pending.");
      }
      expectEqual("Kusanagi direct attack kind", attack.kind, "direct");
      expectEqual("Kusanagi direct attack attacker", attack.attackerId, kusanagi.instanceId);

      for (let i = 0; i < 4; i += 1) {
        const pendingChoice = await pom.harness.evalEngine(
          (engine) => engine.getState().G.turnMetadata.pendingChoice,
        );
        if (!pendingChoice) {
          break;
        }
        if (
          pendingChoice.type === "chooseTarget" &&
          pendingChoice.payload.type === "effectTarget" &&
          pendingChoice.payload.targetKind === "gig"
        ) {
          const targetId = pendingChoice.payload.eligibleIds?.[0];
          if (!targetId) {
            throw new Error("Expected Dying Night to expose at least one Gig target.");
          }
          await pom.resolveEffectTarget([String(targetId)], CYBERPUNK_P1);
          continue;
        }
        if (pendingChoice.type === "chooseTarget" && pendingChoice.payload.type === "adjustGig") {
          const currentRivalGigs = await pom.getGigDice(CYBERPUNK_P2);
          const adjustedGig =
            currentRivalGigs.find((gig) => gig.id === String(pendingChoice.payload.dieId)) ??
            currentRivalGigs[0]!;
          await pom.resolveAdjustGig(Math.max(1, adjustedGig.faceValue - 2), CYBERPUNK_P1);
          continue;
        }
        if (pendingChoice.type === "chooseTrigger") {
          const triggerAdvance = view.container.querySelector<HTMLElement>(
            '[data-testid="phase-hud"][data-choice-in-progress="true"] [data-testid="phase-advance"]',
          );
          const triggerHud = triggerAdvance?.closest('[data-testid="phase-hud"]');
          expectEqual(
            "trigger dock action label",
            triggerAdvance?.getAttribute("aria-label"),
            "Choose Trigger",
          );
          expectEqual(
            "trigger dock omits duplicate prompt label",
            Boolean(triggerHud?.querySelector('[data-testid="phase-hud-label"]')),
            false,
          );
          await pom.resolveTriggerPass(CYBERPUNK_P1);
          continue;
        }
        throw new Error(
          `Unexpected pending choice before attack resolution: ${pendingChoice.type}`,
        );
      }
      const rivalGigs = await pom.getGigDice(CYBERPUNK_P2);
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1, {
        gigIdsToSteal: rivalGigs.map((gig) => gig.id),
      });

      expectEqual("gear bench player Gigs after steal", await pom.getGigCount(CYBERPUNK_P1), 4);
      expectEqual("gear bench rival Gigs after steal", await pom.getGigCount(CYBERPUNK_P2), 0);
      for (const gig of rivalGigs) {
        await pom.expectGigValue(gig.id, gig.faceValue);
      }
    } finally {
      view.unmount();
    }
  });
});
