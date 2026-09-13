import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";

import { snatchRed } from "./snatch.ts";
import { impenetrableBeliefRed } from "./impenetrable-belief.ts";

/**
 * Impenetrable Belief, Red (MON075) — Light Action - Attack, cost 2, 5{p}, 2{d}.
 * Printed: "If 3 or more cards have been put into an opposing hero's
 * banished zone this turn, Impenetrable Belief gains +2{d} while defending."
 *
 * ENGINE GAP: `3-or-more-cards-put-into-opposing-banished-this-turn` is
 * declared but unhandled. Declaring the attack throws in both directions
 * (AZL015). Pin the trapdoor; the printed 2{d} block remains public.
 */

describe("Impenetrable Belief (MON075) AAA", () => {
  it("happy: attacks at printed 5{p} when the defending clause is off", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [impenetrableBeliefRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(boltyn).attackWith(impenetrableBeliefRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: cards already in the opposing banished zone from setup are not this-turn puts", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: boltyn,
        hand: [impenetrableBeliefRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([impenetrableBeliefRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(18);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [impenetrableBeliefRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([impenetrableBeliefRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(18);
    expectFabCard(Boltyn, impenetrableBeliefRed).toBeIn("graveyard");
  });
});
