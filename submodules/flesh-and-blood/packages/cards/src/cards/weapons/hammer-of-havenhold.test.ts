import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { chivalryBlue } from "../blocks/chivalry.ts";
import { hammerOfHavenhold } from "./hammer-of-havenhold.ts";

/**
 * Hammer of Havenhold (LGS205) — Guardian Weapon - Hammer (1H), 3{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}{r}: Attack
 *   If you have a Chivalry in your pitch zone, this gets +1{p}.
 */

describe("Hammer of Havenhold (LGS205) AAA", () => {
  it("happy: a Chivalry in the pitch zone gives the hammer +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [hammerOfHavenhold],
        pitch: [chivalryBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(hammerOfHavenhold);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: without a Chivalry in the pitch zone the hammer swings at 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [hammerOfHavenhold],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(hammerOfHavenhold);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});
