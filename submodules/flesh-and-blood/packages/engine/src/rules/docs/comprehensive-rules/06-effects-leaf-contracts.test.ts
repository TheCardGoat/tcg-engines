/**
 * Contract-generated happy + full-block edge tests for every leaf effect
 * in EFFECT_LEAF_CONTRACTS. Primary observables are CR-visible only.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { EFFECT_LEAF_CONTRACTS } from "../../effect-leaf-contracts.ts";
import { KEYWORD_EFFECT_INVENTORY } from "../../keyword-effect-inventory.ts";
import {
  bravo,
  cintariSellsword,
  dash,
  heartOfFyendal,
  ironrotHelm,
  nimblismBlue,
  snatchRed,
} from "../../fixtures.ts";
import { hitTrainer } from "../../test-trainers.ts";

function runHappy(c: (typeof EFFECT_LEAF_CONTRACTS)[number]) {
  const attack = hitTrainer({
    slug: `fx-${c.type}`,
    effect: c.effect,
    power: c.setup?.power ?? 4,
    keywords: c.setup?.keywords,
  });
  const hand: unknown[] = [attack, heartOfFyendal];
  if (c.setup?.attackerHandExtra) {
    hand.push(c.type === "equip" ? ironrotHelm : snatchRed);
  }
  const defHand =
    c.setup?.defenderHand !== undefined
      ? [nimblismBlue]
      : c.type === "freeze" || c.type === "exchange"
        ? [nimblismBlue]
        : [];
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: hand as never,
      deck: [heartOfFyendal, snatchRed, nimblismBlue, heartOfFyendal],
      resourcePoints: c.setup?.attackerResourcePoints ?? (c.type === "pay" ? 1 : 0),
    },
    {
      hero: dash,
      life: 20,
      hand: defHand as never,
      arsenal: c.setup?.defenderArsenal !== undefined ? [snatchRed] : [],
      arena:
        c.setup?.defenderArenaCards ??
        (c.setup?.defenderArena !== undefined ? [cintariSellsword] : []),
      deck: 6,
    },
    // Walks priority/pitch timing by hand - opt out of the smart defaults.
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  game.as(bravo).attackWith(attack);
  const drain = () => {
    if (c.type === "search") {
      game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    } else {
      game.helpers.resolveRestOfCombat();
    }
  };
  try {
    drain();
  } catch (error) {
    const optionId = c.setup?.effectResolutionOptionId;
    const decision = game.getState().decision;
    if (
      optionId &&
      error instanceof Error &&
      error.message.includes("effect-resolution") &&
      decision?.kind === "effect-resolution"
    ) {
      if (!decision.options.some((option) => option.id === optionId)) {
        throw new Error(`Expected public effect-resolution option ${optionId}.`);
      }
      game.answerDecision(decision.actorId, { kind: "effect-resolution", optionId });
      drain();
    } else {
      throw error;
    }
  }
  return game;
}

function runEdge(c: (typeof EFFECT_LEAF_CONTRACTS)[number]) {
  const attack = hitTrainer({
    slug: `fx-${c.type}-edge`,
    effect: c.effect,
    power: c.setup?.power ?? 4,
    keywords: c.setup?.keywords,
  });
  const hand: unknown[] = [attack, heartOfFyendal];
  if (c.setup?.attackerHandExtra) {
    hand.push(c.type === "equip" ? ironrotHelm : snatchRed);
  }
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: hand as never,
      deck: [heartOfFyendal, snatchRed, nimblismBlue, heartOfFyendal],
      resourcePoints: c.setup?.attackerResourcePoints ?? (c.type === "pay" ? 1 : 0),
    },
    {
      hero: dash,
      life: 20,
      hand: [nimblismBlue, snatchRed],
      arsenal: c.setup?.defenderArsenal !== undefined ? [heartOfFyendal] : [],
      arena:
        c.setup?.defenderArenaCards ??
        (c.setup?.defenderArena !== undefined ? [cintariSellsword] : []),
      deck: 4,
    },
    // Walks priority/pitch timing by hand - opt out of the smart defaults.
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  game.as(bravo).attackWith(attack);
  game.as(dash).blockWith([nimblismBlue, snatchRed]);
  game.helpers.resolveRestOfCombat();
  return game;
}

describe("CR 6 / 8.5 — leaf effects (contract map)", () => {
  const supportedTypes = new Set(
    KEYWORD_EFFECT_INVENTORY.filter((row) => row.kind === "effect" && row.status === "tested").map(
      (row) => row.id,
    ),
  );
  for (const c of EFFECT_LEAF_CONTRACTS.filter((contract) => supportedTypes.has(contract.type))) {
    it(`${c.cr} ${c.type} happy: primary matches CR-visible happyExpected`, () => {
      const game = runHappy(c);
      expect(c.primary(game)).toEqual(c.happyExpected);
    });

    it(`${c.cr} ${c.type} edge: full block → primary matches edgeExpected (no hit)`, () => {
      const game = runEdge(c);
      expect(game.as(dash).life()).toBe(20);
      expect(c.primary(game)).toEqual(c.edgeExpected);
    });
  }
});
