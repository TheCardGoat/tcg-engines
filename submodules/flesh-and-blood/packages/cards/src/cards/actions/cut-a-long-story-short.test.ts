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
import { cutALongStoryShortYellow } from "./cut-a-long-story-short.ts";

/**
 * Cut a Long Story Short (SUP172) — Guardian Action - Attack, cost 0, 3{p}, 3{d}.
 * Printed: "If this has {p} greater than its base, it gets +1{p}.
 * Tower - If this has 13 or more {p}, it gets \"When this hits a hero, they
 * discard their hand.\""
 */

describe("Cut a Long Story Short (SUP172) AAA", () => {
  it("happy: at printed 3{p} the attack stays 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cutALongStoryShortYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(cutALongStoryShortYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: Nimblism makes {p} greater than base, then this gets +1 more (5 total)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue, cutALongStoryShortYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(cutALongStoryShortYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: at 3{p} Tower does not discard the defending hero's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cutALongStoryShortYellow],
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

    Bravo.playAttack(cutALongStoryShortYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });
});
