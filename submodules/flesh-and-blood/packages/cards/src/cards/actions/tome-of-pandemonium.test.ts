import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tomeOfPandemoniumYellow } from "./tome-of-pandemonium.ts";

/**
 * Tome of Pandemonium (PEN277) — Chaos Action, cost 1, go again.
 *
 * Printed: Banish the top card of each hero's deck. You may play them this turn.
 * Go again
 */

describe("Tome of Pandemonium (PEN277) AAA", () => {
  it("happy: banishes each deck-top and you may play Snatch from banished this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tomeOfPandemoniumYellow],
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(tomeOfPandemoniumYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, snatchRed).toBeBanished();
    expectFabCard(Dash, nimblismBlue).toBeBanished();
    expectFabCard(Bravo, tomeOfPandemoniumYellow).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.playAttack(snatchRed, { from: "banished" });
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: leaving the banished cards unplayed keeps them in the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tomeOfPandemoniumYellow],
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      {
        hero: dash,
        hand: [],
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tomeOfPandemoniumYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, snatchRed).toBeBanished();
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("timing: the play permission does not last into the next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tomeOfPandemoniumYellow],
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tomeOfPandemoniumYellow);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.as(dash).endTurn();

    expectFabUnplayable(
      () => Bravo.playAttack(snatchRed, { from: "banished" }),
      /Playing from banished requires a migrated permission effect/,
    );
    expectFabCard(Bravo, snatchRed).toBeBanished();
  });
});
