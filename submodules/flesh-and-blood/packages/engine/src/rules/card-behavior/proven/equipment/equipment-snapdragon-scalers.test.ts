/**
 * RNR007 Snapdragon Scalers — Generic Legs d0.
 *
 * Printed:
 *   Attack Reaction - Destroy this: Target attack action card with cost 1 or
 *   less gets go again.
 *
 * Reasoning (hand-authored, riding the proven AAC007 stalker-s-steps path):
 * 1. Attack Reaction — illegal outside the reaction step.
 * 2. On-stack target is the combat-chain attack, filtered to Action+Attack with
 *    cost ≤ 1. snatchRed (Generic Action Attack, cost 0, no native go again) is
 *    a legal target; the granted go again refunds an AP after the chain closes.
 * 3. Boundary: a cost-2 attack (demolitionCrewRed) is NOT a legal target, so
 *    the reaction cannot be declared on it.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, swingBigRed } from "../../../fixtures.ts";

import { snapdragonScalers } from "../../../../../../cards/src/cards/equipment/snapdragon-scalers.ts";
import { engulfingLightRed } from "../../../../../../cards/src/cards/actions/engulfing-light.ts";
import { boltOfCourageRed } from "../../../../../../cards/src/cards/actions/bolt-of-courage.ts";
import { boltyn } from "../../../../../../cards/src/cards/heroes/boltyn.ts";

const STARTING_LIFE = 40;

describe("snapdragon-scalers (RNR007)", () => {
  it("boundaries: Attack Reaction illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [snapdragonScalers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    // No combat chain open → reaction cannot be declared.
    expect(() => game.as(bravo).activate(snapdragonScalers)).toThrow();
    expect(game.as(bravo).zone("legs")).toContain(snapdragonScalers.canonicalId);
  });

  it("core mechanic: destroy-self grants go again to a cost-0 attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [snapdragonScalers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    // snatchRed: Generic Action Attack, cost 0, power 4, NO native go again.
    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    Bravo.activate(snapdragonScalers);
    // Resolve the on-stack target (the cost≤1 attack on the chain).
    for (let s = 0; s < 12; s += 1) {
      const d = game.getState().decision;
      if (d?.kind === "entity-target") {
        const pick = d.candidates[0]?.instanceId;
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "entity-target", instanceIds: [pick!] },
          },
        });
        continue;
      }
      if (d && game.answerForcedDecision()) continue;
      break;
    }
    game.passBoth();

    expect(Bravo.zone("legs")).not.toContain(snapdragonScalers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(snapdragonScalers.canonicalId);
    // Granted go again is now on the active attack.
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");

    game.helpers.resolveRestOfCombat();
    // go again refunded the AP spent to play the attack.
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("LKI: granted go again resolves after the charged attack moves itself to soul on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        legs: [snapdragonScalers],
        hand: [engulfingLightRed, boltOfCourageRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(engulfingLightRed, {
      charge: true,
      chargeCard: boltOfCourageRed,
    });
    game.toReaction("attacker");
    Boltyn.activate(snapdragonScalers);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expect(Boltyn.zone("soul")).toContain(engulfingLightRed.canonicalId);
    expect(Boltyn.actionPoints()).toBe(1);
  });

  it("boundaries: cost-2 attack is not a legal target (cost≤1 filter)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [snapdragonScalers],
        hand: [swingBigRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    // swingBigRed: Brute Action Attack, cost 2, power 6, no additional cost.
    Bravo.attackWith(swingBigRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    // No cost≤1 Action+Attack on the chain → reaction target undeclarable.
    expect(() => Bravo.activate(snapdragonScalers)).toThrow();
    // Not destroyed because the reaction was never declared.
    expect(Bravo.zone("legs")).toContain(snapdragonScalers.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(snapdragonScalers.canonicalId);
  });
});
