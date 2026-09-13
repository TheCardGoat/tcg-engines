/**
 * UPR159 Tide Flippers — Ninja Legs d0 (Arcane Barrier 1).
 *
 * Printed:
 *   Attack Reaction - Destroy Tide Flippers: Target attack action card with
 *   2 or less base {p} gains go again.
 *
 * Reasoning (hand-authored, riding the proven BEN006 fleet-foot-sandals path):
 * 1. Attack Reaction — illegal outside the reaction step.
 * 2. Card-model fix: parser left a garbage `or/and subtypes` filter
 *    (["Action"],["Card"],["With"],["2"],["Less"],["Base"],["{p}"]) matching
 *    nothing. Replaced with typed Action+Attack + numeric base-power≤2 filter.
 * 3. spring-load (Generic Action Attack, base power 2, NO native go again) is a
 *    legal target (proves the ≤2 inclusive bound); granted go again refunds AP.
 * 4. Boundary: a base-power-4 attack (snatchRed) is NOT a legal target.
 *
 * Arcane Barrier 1 is a defensive keyword, not exercised here (incidental).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { snatchRed } from "../../../fixtures.ts";

import { tideFlippers } from "../../../../../../cards/src/cards/equipment/tide-flippers.ts";
import { springLoadRed } from "../../../../../../cards/src/cards/actions/spring-load.ts";
import { uzuri } from "../../../../../../cards/src/cards/heroes/uzuri.ts";
import { dash } from "../../../../../../cards/src/cards/heroes/dash.ts";

const STARTING_LIFE = 40;

describe("tide-flippers (UPR159)", () => {
  it("boundaries: Attack Reaction illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [tideFlippers],
        hand: [springLoadRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(uzuri).activate(tideFlippers)).toThrow();
    expect(game.as(uzuri).zone("legs")).toContain(tideFlippers.canonicalId);
  });

  it("core mechanic: destroy-self grants go again to a base-power-2 action attack", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [tideFlippers],
        hand: [springLoadRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Uzuri = game.as(uzuri);
    const Opponent = game.as(dash);

    // spring-load: Generic Action Attack, cost 1, base power 2, no native go again.
    Uzuri.attackWith(springLoadRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Uzuri.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    Uzuri.activate(tideFlippers);
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

    expect(Uzuri.zone("legs")).not.toContain(tideFlippers.canonicalId);
    expect(Uzuri.zone("graveyard")).toContain(tideFlippers.canonicalId);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");

    game.helpers.resolveRestOfCombat();
    // go again refunded the AP spent to play the attack.
    expect(Uzuri.actionPoints()).toBe(1);
  });

  it("boundaries: base-power-4 attack is not a legal target (base {p}≤2 filter)", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        legs: [tideFlippers],
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

    // No base-{p}≤2 Action attack on the chain → reaction target undeclarable.
    expect(() => Uzuri.activate(tideFlippers)).toThrow();
    expect(Uzuri.zone("legs")).toContain(tideFlippers.canonicalId);
    expect(Uzuri.zone("graveyard")).not.toContain(tideFlippers.canonicalId);
  });
});
