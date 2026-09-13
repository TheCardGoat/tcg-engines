import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { publicBountyRed } from "./public-bounty.ts";

describe("Public Bounty (HNT241) AAA", () => {
  it("happy: marks the opposing hero and the next attack against them gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [publicBountyRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(publicBountyRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toBeMarked();
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("boundary: a later attack this turn does not get another +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [publicBountyRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(publicBountyRed);
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    Bravo.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the unused attack bonus expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [publicBountyRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(publicBountyRed);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    Dash.endTurn();

    Bravo.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
