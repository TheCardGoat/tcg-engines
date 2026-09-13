/**
 * OUT141 Blade Cuff — Assassin Ninja Arms d1 Blade Break.
 *
 * Printed:
 *   Action - {r}{r}, destroy Blade Cuff: Your daggers gain +1{p} this turn.
 *   Go again
 *
 * Reasoning (hand-authored):
 * 1. CARD MODEL FIX: the prior model targeted combat-chain objects with
 *    moniker:"Dagger" at resolution — at-resolution combat-chain does not
 *    float to later dagger attacks this turn (gallantry-gold failure mode).
 *    Remodeled to the floating aura shape: appliesTo.next types:["Dagger"]
 *    + count:star (this-turn, every dagger attack — stubby-hammerers /
 *    gallantry-gold Infinity path). Dagger is a type-line token on weapons
 *    (e.g. DYN069/KSU003 types include "Dagger"), so the matcher latches
 *    weapon attacks and skips non-dagger attacks.
 * 2. Happy: activate → quicksilver dagger (base 1) deals 1+1 = 2.
 * 3. Multi-fire: a second dagger attack the same turn is also +1 (count star).
 * 4. Filter boundary: a non-dagger attack (snatch) is NOT buffed.
 * 5. No-activate boundary: dagger deals its base 1.
 *
 * Status: ✅ destroy → every dagger attack +1{p} this turn + go again;
 * non-dagger and no-activate boundaries.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { bladeCuff } from "../../../../../../cards/src/cards/equipment/blade-cuff.ts";
import { quicksilverDagger } from "../../../../../../cards/src/cards/weapons/quicksilver-dagger.ts";
import { harmonizedKodachi } from "../../../../../../cards/src/cards/weapons/harmonized-kodachi.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("blade-cuff (OUT141)", () => {
  it("core: destroy-self → dagger attack gets +1{p}; go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bladeCuff],
        weapon1: [quicksilverDagger],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(bladeCuff);
    drain(game);

    // Destroy-self paid: arms → graveyard; go again refunded the AP.
    expect(Bravo.zone("arms")).not.toContain(bladeCuff.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bladeCuff.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
    expect(Bravo.resourcePoints()).toBe(1); // 3 - 2 for the activation

    // Dagger (base 1) +1 → 2 damage.
    Bravo.activate(quicksilverDagger);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 2);
  });

  it("multi-fire: every dagger attack this turn is buffed (count star)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bladeCuff],
        weapon1: [quicksilverDagger],
        weapon2: [harmonizedKodachi],
        hand: [],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(bladeCuff);
    drain(game);

    // First dagger: 1 + 1 = 2.
    Bravo.activate(quicksilverDagger);
    game.helpers.resolveRestOfCombat();
    // Second dagger (harmonized kodachi, base 1) same turn: also +1 → 2.
    Bravo.activate(harmonizedKodachi);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 4);
  });

  it("filter boundary: non-dagger attack is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bladeCuff],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(bladeCuff);
    drain(game);

    // snatch is an attack ACTION CARD, not a dagger — no +1.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 4);
  });

  it("boundary: without activating, the dagger deals its base 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bladeCuff],
        weapon1: [quicksilverDagger],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(quicksilverDagger);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 1);
    // Blade Cuff never activated — still seated.
    expect(Bravo.zone("arms")).toContain(bladeCuff.canonicalId);
  });
});
