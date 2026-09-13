import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { brandWithCinderclawRed } from "./brand-with-cinderclaw.ts";
import { artOfTheDragonFireRed } from "./art-of-the-dragon-fire.ts";

/**
 * Art of the Dragon: Fire (CIN007) — Ninja Attack, cost 1, 5{p}.
 *
 * Printed: When this attacks, if it is Draconic, deal 2 damage to any target.
 */

describe("Art of the Dragon: Fire (CIN007) AAA", () => {
  it("happy: Draconic this deals 2 on attack plus 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, artOfTheDragonFireRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(artOfTheDragonFireRed, { stopAt: "on-attack" });
    Fai.target(Dash);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(10);
  });

  it("boundary: without Draconic it deals only printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [artOfTheDragonFireRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(artOfTheDragonFireRed);
    game.closeCombat({ ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: the 2 damage resolves before combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, artOfTheDragonFireRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(artOfTheDragonFireRed, { stopAt: "on-attack" });
    Fai.target(Dash);
    game.advanceUntil({ stopAt: "defend" });

    // Brand's 3{p} already resolved on the prior link; only this ping is new.
    expectFabPlayer(Dash).toHaveLife(15);
    expectCombat(game).toBeOpen();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(10);
  });
});
