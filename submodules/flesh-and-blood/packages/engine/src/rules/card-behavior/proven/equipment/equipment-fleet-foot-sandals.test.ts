/**
 * BEN006 Fleet Foot Sandals — Generic Legs d0.
 *
 * Printed:
 *   Attack Reaction - Destroy this: Target attack with 1 or less base {p} gains
 *   go again.
 *
 * Reasoning (hand-authored, riding the proven RNR007 snapdragon-scalers path):
 * 1. Attack Reaction — illegal outside the reaction step.
 * 2. Card-model fix: the parser left a garbage `or/and subtypes` filter
 *    (["With"],["1"],["Less"],["Base"],["{p}"]) that matched nothing. Replaced
 *    with the typed base-power filter `numeric: power base lte 1`.
 * 3. infectBlue (Assassin Action Attack, base power 1, NO native go again) is a
 *    legal target; the granted go again refunds an AP after the chain closes.
 * 4. Boundary: a base-power-4 attack (snatchRed) is NOT a legal target.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { snatchRed } from "../../../fixtures.ts";

import { fleetFootSandals } from "../../../../../../cards/src/cards/equipment/fleet-foot-sandals.ts";
import { infectBlue } from "../../../../../../cards/src/cards/actions/infect.ts";
import { uzuri } from "../../../../../../cards/src/cards/heroes/uzuri.ts";
import { dash } from "../../../../../../cards/src/cards/heroes/dash.ts";

const STARTING_LIFE = 40;

describe("fleet-foot-sandals (BEN006)", () => {
  it("boundaries: Attack Reaction illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [fleetFootSandals],
        hand: [infectBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    // No combat chain open → reaction cannot be declared.
    expect(() => game.as(uzuri).activate(fleetFootSandals)).toThrow();
    expect(game.as(uzuri).zone("legs")).toContain(fleetFootSandals.canonicalId);
  });

  it("core mechanic: destroy-self grants go again to a base-power-1 attack", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [fleetFootSandals],
        hand: [infectBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Uzuri = game.as(uzuri);
    const Opponent = game.as(dash);

    // infectBlue: Assassin Action Attack, cost 0, base power 1, no native go again.
    Uzuri.attackWith(infectBlue);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Uzuri.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    Uzuri.activate(fleetFootSandals);
    // Resolve the on-stack target (the base-{p}≤1 attack on the chain).
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

    expect(Uzuri.zone("legs")).not.toContain(fleetFootSandals.canonicalId);
    expect(Uzuri.zone("graveyard")).toContain(fleetFootSandals.canonicalId);
    // Granted go again is now on the active attack.
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");

    game.helpers.resolveRestOfCombat();
    // go again refunded the AP spent to play the attack.
    expect(Uzuri.actionPoints()).toBe(1);
  });

  it("boundaries: base-power-4 attack is not a legal target (base {p}≤1 filter)", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [fleetFootSandals],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Uzuri = game.as(uzuri);
    const Opponent = game.as(dash);

    // snatchRed: Generic Action Attack, base power 4.
    Uzuri.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Uzuri.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    // No base-{p}≤1 attack on the chain → reaction target undeclarable.
    expect(() => Uzuri.activate(fleetFootSandals)).toThrow();
    expect(Uzuri.zone("legs")).toContain(fleetFootSandals.canonicalId);
    expect(Uzuri.zone("graveyard")).not.toContain(fleetFootSandals.canonicalId);
  });
});
