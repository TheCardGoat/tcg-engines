import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { shadenScreamRed } from "./shaden-scream.ts";
import { shadenDeathHydraYellow } from "./shaden-death-hydra.ts";

/**
 * Shaden Death Hydra (DTD108) — Shadow Brute Attack, cost 6, 13{p}.
 *
 * Printed: When this attacks, it deals X damage to you, where X is 13 minus
 * the number of cards with blood debt in your banished zone. Blood Debt.
 *
 * Pin: banished blood-debt count is 0 (family engine/blood-debt-banished-count).
 */

describe("Shaden Death Hydra (DTD108) AAA", () => {
  it("happy: empty banished deals 13 to you on attack then 13{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadenDeathHydraYellow],
        resourcePoints: 6,
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(shadenDeathHydraYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectFabPlayer(Levia).toHaveLife(27);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(27);
  });

  it("boundary: one blood-debt banished still deals 13 (count pin)", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadenDeathHydraYellow],
        banished: [shadenScreamRed],
        resourcePoints: 6,
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.playAttack(shadenDeathHydraYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });

    // Pin: cards-in-zone hasKeyword blood-debt does not count the banished
    // scream (family engine/blood-debt-banished-count). Printed X is 12.
    expectFabPlayer(Levia).toHaveLife(27);
    expectCombat(game).toBeOpen();
  });

  it("timing: self-damage resolves before combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadenDeathHydraYellow],
        resourcePoints: 6,
        actionPoints: 1,
        life: 40,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playAttack(shadenDeathHydraYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectFabPlayer(Levia).toHaveLife(27);
    expectFabPlayer(Dash).toHaveLife(40);
    expectCombat(game).toBeOpen();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(27);
  });
});
