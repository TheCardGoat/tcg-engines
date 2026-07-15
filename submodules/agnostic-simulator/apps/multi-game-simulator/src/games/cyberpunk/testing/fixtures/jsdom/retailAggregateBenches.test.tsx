import { describe, test, vi } from "vite-plus/test";
import { act, waitFor } from "@testing-library/react";
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

      expectEqual("program bench hand size", await pom.getHandSize(CYBERPUNK_P1), 8);
      expectEqual("program bench player field size", await pom.getFieldSize(CYBERPUNK_P1), 4);
      expectEqual("program bench opponent field size", await pom.getFieldSize(CYBERPUNK_P2), 5);

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

  test("plays Yorinobu's selected free Unit without a redundant confirmation", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailCombatGigBench" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const yorinobu = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailYorinobuArasakaSteelDragon.id,
      );
      const hanako = await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailHanakoArasakaInAGildedCage.id,
      );

      await pom.playCardFromHand(yorinobu.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!eligible.includes(hanako.instanceId)) {
        throw new Error("Expected Yorinobu to offer Hanako as the free Unit from trash.");
      }
      await pom.resolveEffectTarget([hanako.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.getCardInZoneByInstanceId("field", CYBERPUNK_P1, hanako.instanceId);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("surfaces Augmented Negotiators blocker trigger cues and log order", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailProgramTargetBench" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const tBug = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailTBugAmateurPhilosopher.id,
      );
      const augmentedNegotiators = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        c.welcomeToNightCityRetailAugmentedNegotiators.id,
      );

      await pom.attackRival(tBug.instanceId, CYBERPUNK_P1);
      await resolvePendingAttackChoices(pom);
      await pom.resolveAttack(CYBERPUNK_P1);
      const blockerResult = await pom.harness.dispatchEngine(
        (engine, payload) => engine.useBlocker(payload.blockerId, { as: payload.as }),
        { blockerId: augmentedNegotiators.instanceId, as: CYBERPUNK_P2 },
      );

      const pendingChoice = await pom.harness.evalEngine(
        (engine) => engine.getState().G.turnMetadata.pendingChoice,
      );
      expectEqual("Augmented Negotiators pending choice", pendingChoice?.type, "chooseTarget");
      if (pendingChoice?.type !== "chooseTarget") {
        throw new Error("Expected Augmented Negotiators to create a discard choice.");
      }
      expectEqual(
        "Augmented Negotiators choice kind",
        pendingChoice.payload.type,
        "discardFromHand",
      );
      expectEqual(
        "Augmented Negotiators choice source",
        String(pendingChoice.payload.sourceCardId),
        augmentedNegotiators.instanceId,
      );
      expectEqual("Augmented Negotiators discard chooser", pendingChoice.chooserId, CYBERPUNK_P1);

      const bannerTitle = view.container.querySelector<HTMLElement>(
        '[data-testid="prompt-banner"][data-side="player"] [data-testid="prompt-banner-title"]',
      );
      if (!bannerTitle?.textContent?.includes("Augmented Negotiators")) {
        throw new Error("Expected the discard prompt to name Augmented Negotiators.");
      }

      const sourceCard = view.container.querySelector<HTMLElement>(
        `[data-testid="card"][data-card-id="${augmentedNegotiators.instanceId}"]`,
      );
      expectEqual(
        "Augmented Negotiators active trigger cue",
        sourceCard?.getAttribute("data-active-trigger-source"),
        "true",
      );

      const resolvingCard = view.container.querySelector<HTMLElement>(
        '[data-testid="resolving-program"]',
      );
      expectEqual(
        "Augmented Negotiators resolving trigger source",
        resolvingCard?.getAttribute("data-card-id"),
        augmentedNegotiators.instanceId,
      );
      expectEqual(
        "Augmented Negotiators resolving trigger type",
        resolvingCard?.getAttribute("data-card-type"),
        "unit",
      );
      if (!resolvingCard?.textContent?.includes("Blocker trigger")) {
        throw new Error("Expected resolving source helper text to say Blocker trigger.");
      }

      const discardId = pendingChoice.payload.eligibleIds?.[0];
      if (!discardId) {
        throw new Error("Expected Augmented Negotiators to offer a discard candidate.");
      }
      const discardResult = await pom.harness.dispatchEngine(
        (engine, payload) =>
          engine.resolveDiscardFromHand(payload.cardIds, {
            as: payload.as,
          }),
        { cardIds: [String(discardId)], as: CYBERPUNK_P1 },
      );

      const logKeys = [...blockerResult.moveLogs, ...discardResult.moveLogs].map((log) =>
        log.type === "action" ? log.messageKey : log.type,
      );
      const blockerLogIndex = logKeys.indexOf("move.useBlocker");
      const triggerLogIndex = logKeys.indexOf("trigger.autoResolved");
      const discardLogIndex = logKeys.indexOf("resolveDiscardFromHand");

      if (blockerLogIndex === -1 || triggerLogIndex === -1 || discardLogIndex === -1) {
        throw new Error(
          `Expected blocker, trigger, and discard log entries. Got: ${logKeys.join(" | ")}`,
        );
      }
      if (!(blockerLogIndex < triggerLogIndex && triggerLogIndex < discardLogIndex)) {
        throw new Error(`Unexpected blocker trigger log order: ${logKeys.join(" | ")}`);
      }
    } finally {
      view.unmount();
    }
  });

  test("peeks all friendly face-down legends when T-Bug is defeated", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailProgramTargetBench" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const tBug = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailTBugAmateurPhilosopher.id,
      );
      const oversizedDefender = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        c.welcomeToNightCityRetailCorpoSecurity.id,
      );

      expectEqual(
        "T-Bug starts with two face-down friendly legends",
        await pom.getFaceDownLegendsCount(CYBERPUNK_P1),
        2,
      );

      await pom.attackUnit(tBug.instanceId, oversizedDefender.instanceId, CYBERPUNK_P1);
      await resolvePendingAttackChoices(pom);
      await dispatchSimulatorAction({ type: "resolveAttack", as: CYBERPUNK_P1 });
      await dispatchSimulatorAction({ type: "resolveAttack", as: CYBERPUNK_P2, pass: true });
      await dispatchSimulatorAction({ type: "resolveAttack", as: CYBERPUNK_P1 });

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      expectEqual(
        "T-Bug look keeps legends face-down",
        await pom.getFaceDownLegendsCount(CYBERPUNK_P1),
        2,
      );

      const peekedFaceDownLegends = view.container.querySelectorAll(
        '[data-testid="legends-zone"][data-side="player"] [data-testid="legend-slot"][data-face-down="true"][data-peeked="true"]',
      );
      expectEqual("T-Bug peeked all friendly face-down legends", peekedFaceDownLegends.length, 2);
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
      await expectDirectStealCount(view.container, "2", "Kusanagi direct attack steal cue");

      await resolvePendingAttackChoices(pom, {
        onChooseTrigger: () => {
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
        },
      });
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

  test("updates direct attack steal cue after Take Control reduces the theft", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailProgramTargetBench" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.harness.dispatchEngine((engine) =>
        engine.judgeSetTurnMetadata({ activePlayerId: CYBERPUNK_P2 }, { as: CYBERPUNK_P1 }),
      );

      const attacker = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        c.welcomeToNightCityRetailDelamainCab.id,
      );
      const takeControl = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        c.welcomeToNightCityRetailTakeControl.id,
      );

      await pom.attackRival(attacker.instanceId, CYBERPUNK_P2);
      await expectDirectStealCount(view.container, "1", "Take Control bench initial steal cue");

      await pom.resolveAttack(CYBERPUNK_P2);
      await pom.playCardFromHand(takeControl.instanceId, CYBERPUNK_P1);

      await expectDirectStealCount(view.container, "0", "Take Control bench reduced steal cue");
    } finally {
      view.unmount();
    }
  });
});

type RetailBenchPom = ReturnType<typeof createTestingLibraryCyberpunkSimulatorPom>;

async function resolvePendingAttackChoices(
  pom: RetailBenchPom,
  opts: { onChooseTrigger?: () => void } = {},
): Promise<void> {
  const seenChoices: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    const pendingChoice = await pom.harness.evalEngine(
      (engine) => engine.getState().G.turnMetadata.pendingChoice,
    );
    if (!pendingChoice) {
      return;
    }
    seenChoices.push(
      pendingChoice.type === "chooseTarget"
        ? `${pendingChoice.type}:${pendingChoice.payload.type}`
        : pendingChoice.type,
    );
    if (pendingChoice.type === "chooseTarget" && pendingChoice.payload.type === "effectTarget") {
      const targetId = pendingChoice.payload.eligibleIds?.[0];
      if (!targetId) {
        throw new Error("Expected effect target choice to expose at least one target.");
      }
      await pom.resolveEffectTarget([String(targetId)], pendingChoice.chooserId);
      continue;
    }
    if (pendingChoice.type === "chooseTarget" && pendingChoice.payload.type === "adjustGig") {
      const value = adjustedGigValue(pendingChoice.payload);
      await pom.resolveAdjustGig(value, pendingChoice.chooserId);
      continue;
    }
    if (pendingChoice.type === "chooseTrigger") {
      opts.onChooseTrigger?.();
      const firstTrigger = pendingChoice.payload.options[0];
      if (!firstTrigger) {
        throw new Error("Expected chooseTrigger to expose at least one option.");
      }
      if (pendingChoice.payload.canPass) {
        await pom.resolveTriggerPass(pendingChoice.chooserId);
      } else {
        await pom.resolveTrigger(firstTrigger.triggerId, pendingChoice.chooserId);
      }
      continue;
    }
    if (pendingChoice.type === "chooseCardToMove") {
      const cardId = pendingChoice.payload.cardIds[0];
      if (!cardId) {
        throw new Error("Expected chooseCardToMove to expose at least one card.");
      }
      await pom.resolveCardToMove(String(cardId), pendingChoice.chooserId);
      continue;
    }
    throw new Error(`Unexpected pending choice before blocker: ${pendingChoice.type}`);
  }
  throw new Error(
    `Pending attack choices did not settle before blocker selection: ${seenChoices.join(" -> ")}`,
  );
}

function adjustedGigValue(payload: {
  readonly currentValue?: number;
  readonly maxFaceValue?: number;
  readonly maxAmount?: number;
  readonly direction?: string;
}): number {
  const current = payload.currentValue ?? 1;
  const max = payload.maxFaceValue ?? current;
  const amount = payload.maxAmount ?? 0;
  if (payload.direction === "decrease") {
    return Math.max(1, current - amount);
  }
  if (payload.direction === "increase") {
    return Math.min(max, current + amount);
  }
  return current;
}

async function dispatchSimulatorAction(action: Record<string, unknown>): Promise<void> {
  await act(async () => {
    const simulator = (
      window as unknown as {
        __cyberpunkSimulator?: { dispatch?: (action: Record<string, unknown>) => unknown };
      }
    ).__cyberpunkSimulator;
    if (!simulator?.dispatch) {
      throw new Error("Expected the Cyberpunk simulator dispatch bridge to be available.");
    }
    simulator.dispatch(action);
  });
}

async function expectDirectStealCount(
  container: HTMLElement,
  expected: string,
  label: string,
): Promise<void> {
  await waitFor(() =>
    expectEqual(
      label,
      container.querySelector('[data-testid="direct-attack-steal-count"]')?.textContent?.trim(),
      expected,
    ),
  );
}
