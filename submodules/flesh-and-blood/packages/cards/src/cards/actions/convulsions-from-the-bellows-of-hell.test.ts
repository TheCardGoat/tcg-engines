import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { levia } from "../heroes/levia.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { convulsionsFromTheBellowsOfHellRed } from "./convulsions-from-the-bellows-of-hell.ts";

/**
 * Convulsions from the Bellows of Hell (MON132) — Shadow Brute Action,
 * cost 2, 3{d}.
 *
 * Printed: "As an additional cost to play Convulsions from the Bellows of
 * Hell, banish 3 random cards from your graveyard.
 * If a card with 6 or more {p} is banished this way, the next attack action
 * card you play this turn gains +3{p} and dominate.
 * Go again"
 */

describe("Convulsions from the Bellows of Hell family AAA", () => {
  it("happy: banishing a 6+{p} card this way gives the next attack action +3{p} and dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [convulsionsFromTheBellowsOfHellRed, snatchRed],
        graveyard: [nimblismBlue, nimblismBlue, smashWithBigTreeRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.play(convulsionsFromTheBellowsOfHellRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabCard(Levia, convulsionsFromTheBellowsOfHellRed).toBeIn("graveyard");
    expect(Levia.zone("banished")).toHaveLength(3);

    Levia.playAttack(snatchRed);
    // Snatch 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
    const rejection = game.as(dash).expectBlockRejected([snatchRed, snatchRed]);
    expect(rejection.errorCode).toBe("dominate");
  });

  it("boundary: with an empty graveyard the required banish cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [convulsionsFromTheBellowsOfHellRed],
        graveyard: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.play(convulsionsFromTheBellowsOfHellRed));
    expectFabCard(Levia, convulsionsFromTheBellowsOfHellRed).toBeIn("hand");
  });

  it("timing: printed 3{d} still defends an opposing attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: levia,
        hand: [convulsionsFromTheBellowsOfHellRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Levia = game.as(levia);

    Dash.playAttack(snatchRed);
    Levia.defendWith(convulsionsFromTheBellowsOfHellRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, convulsionsFromTheBellowsOfHellRed).toBeIn("graveyard");
  });
});
