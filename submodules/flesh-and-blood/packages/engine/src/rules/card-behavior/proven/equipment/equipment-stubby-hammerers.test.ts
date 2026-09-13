/**
 * MON239 Stubby Hammerers — Generic Arms d0.
 *
 * Printed:
 *   Action - Destroy Stubby Hammerers: Attack action cards with 3 or less base
 *   power gain +1{p} while attacking this turn. Go again
 *
 * Reasoning (hand-authored):
 * 1. Action destroy-self + go again (AP refund).
 * 2. Card-model fix: the parser left a `zones: combat-chain` + `hasStatus`
 *    target that never re-applied to later attacks. Remodeled on the proven
 *    ELE235 cracker-jax `appliesTo.next` floating-applicator shape, with
 *    `count: star` for the unbounded "all matching attacks this turn" aura.
 * 3. Engine fix: `continuousFutureApplicability` / `extractStaticFutureApplicability`
 *    now accept `count: {type:"star"}` → Infinity quota (reconciler decrement
 *    already handles Infinity). Unblocks the gallantry-gold / crater-fist family.
 * 4. one-two-punch (base power 1, no self power-buff) attacked after the
 *    activate gains +1{p} → power 2.
 * 5. Boundary: snatchRed (base power 4) exceeds the ≤3 filter → not buffed.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { stubbyHammerers } from "../../../../../../cards/src/cards/equipment/stubby-hammerers.ts";
import { oneTwoPunchBlue } from "../../../../../../cards/src/cards/actions/one-two-punch.ts";

const STARTING_LIFE = 40;

describe("stubby-hammerers (MON239)", () => {
  it("core mechanic: destroy + go again; next ≤3-base-power attack action gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [stubbyHammerers],
        hand: [oneTwoPunchBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    // Activate in the action phase: destroy + go again.
    Bravo.activate(stubbyHammerers);
    game.passBoth();

    expect(Bravo.zone("arms")).not.toContain(stubbyHammerers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(stubbyHammerers.canonicalId);
    // Action cost 1 AP, go again refunds 1 AP.
    expect(Bravo.actionPoints()).toBe(1);

    // one-two-punch (base power 1, no native go again/buff) → aura +1{p} → 2.
    Bravo.attackWith(oneTwoPunchBlue);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    game.helpers.resolveRestOfCombat();

    // No defense → one-two-punch (1 + 1 aura) deals 2.
    expect(Opponent.life()).toBe(STARTING_LIFE - 2);
  });

  it("boundaries: base-power-4 attack exceeds the ≤3 filter and is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [stubbyHammerers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(stubbyHammerers);
    game.passBoth();

    // snatchRed base power 4 > 3 → aura does not apply.
    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    game.helpers.resolveRestOfCombat();

    // No buff → snatch deals its full 4.
    expect(Opponent.life()).toBe(STARTING_LIFE - 4);
  });

  it("aura applies to multiple qualifying attacks this turn (count: star)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [stubbyHammerers],
        hand: [oneTwoPunchBlue, oneTwoPunchBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(stubbyHammerers);
    game.passBoth();
    expect(Bravo.actionPoints()).toBe(2); // go again refunded the action cost

    // First qualifying attack: one-two-punch 1 + 1 aura = 2.
    Bravo.attackWith(oneTwoPunchBlue);
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(STARTING_LIFE - 2);

    // Second qualifying attack this turn also gains the aura (count: star).
    Bravo.attackWith(oneTwoPunchBlue);
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(STARTING_LIFE - 4);
  });
});
