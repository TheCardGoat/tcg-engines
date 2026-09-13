import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { noTallTalesYellow } from "./no-tall-tales.ts";

/**
 * No Tall Tales (SUP170) — Guardian Action - Attack, cost 0, 3{p}, 3{d}.
 * Printed: "If this has {p} greater than its base, it gets +1{p}.
 * Tower - If this has 13 or more {p}, it gets \"When this hits a hero, cards
 * they own lose and can't get go again during their next action phase.\""
 */

describe("No Tall Tales (SUP170) AAA", () => {
  it("happy: at printed 3{p} the attack stays 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [noTallTalesYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(noTallTalesYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: Nimblism makes {p} greater than base, then this gets +1 more (5 total)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue, noTallTalesYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(noTallTalesYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: at 3{p} Tower does not strip go again on the defender's next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [noTallTalesYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(noTallTalesYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(17);

    Bravo.endTurn();
    game.helpers.untilIdle();
    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
