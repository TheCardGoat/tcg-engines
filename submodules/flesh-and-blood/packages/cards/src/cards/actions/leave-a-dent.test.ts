import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { overTheTopYellow } from "./over-the-top.ts";
import { snatchRed } from "./snatch.ts";
import { leaveADentBlue } from "./leave-a-dent.ts";

/**
 * Leave a Dent (MPG020) — next Guardian attack this turn gets Crush (4+ damage mill 4).
 */

describe("Leave a Dent (MPG020) AAA", () => {
  it("happy: the next Guardian attack that deals 4+ mills 4", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leaveADentBlue, overTheTopYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 10 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leaveADentBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(overTheTopYellow);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(15);
    expect(Dash.zone("deck")).toHaveLength(6);
  });

  it("boundary: a Generic attack does not mill", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leaveADentBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 10 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leaveADentBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("deck")).toHaveLength(10);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leaveADentBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([leaveADentBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
