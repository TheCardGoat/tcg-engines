import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { might } from "../tokens/might.ts";
import { cutTheSmallTalkYellow } from "./cut-the-small-talk.ts";

/**
 * Cut the Small Talk (SUP174) — Guardian Action - Attack, cost 0, 3{p}, 3{d}.
 * Printed: "If this has {p} greater than its base, it gets +1{p}.
 * Tower - If this has 13 or more {p}, it gets \"When this hits a hero, destroy
 * all auras they control.\""
 */

describe("Cut the Small Talk (SUP174) AAA", () => {
  it("happy: at printed 3{p} the attack stays 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cutTheSmallTalkYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(cutTheSmallTalkYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: Nimblism makes {p} greater than base, then this gets +1 more (5 total)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue, cutTheSmallTalkYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(cutTheSmallTalkYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: at 3{p} Tower does not destroy auras the defending hero controls", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cutTheSmallTalkYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [might],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(cutTheSmallTalkYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, might).toBeIn("arena");
  });
});
