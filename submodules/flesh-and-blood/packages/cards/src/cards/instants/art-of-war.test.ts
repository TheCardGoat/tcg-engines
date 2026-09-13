import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { artOfWarYellow } from "./art-of-war.ts";

describe("Art of War (ARC160) AAA", () => {
  it("happy: a1+a2 give later AACs +1{p} and leftover AP after close", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [artOfWarYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(artOfWarYellow, { modeIndexes: [0, 1] });
    Dash.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabCard(Dash, artOfWarYellow).toBeIn("graveyard");
  });

  it("boundary: unpicked a3/a4 do not allow arsenal-defend or draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [artOfWarYellow],
        arsenal: [brutalAssaultBlue],
        resourcePoints: 1,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.pass();
    Bravo.play(artOfWarYellow, { modeIndexes: [0, 1] });
    game.passBoth();
    expectFabPlayer(Bravo).toHaveHandCount(0);
    expectFabCard(Bravo, artOfWarYellow).toBeIn("graveyard");

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expect(() => Bravo.defendWith(brutalAssaultBlue)).toThrow();
    expectFabCard(Bravo, brutalAssaultBlue).toBeIn("arsenal");
  });

  it("happy: a1 gives a later defending AAC +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [artOfWarYellow, brutalAssaultBlue],
        resourcePoints: 1,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Dash = game.as(dash);

    game.as(bravo).pass();
    Dash.play(artOfWarYellow, { modeIndexes: [0, 1] });
    game.helpers.resolveUntilIdle();
    game.as(bravo).playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("happy: a1 played onto an already-open chain gives that attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [artOfWarYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.advanceUntil({ stopAt: "reaction" });
    Dash.play(artOfWarYellow, { modeIndexes: [0, 1] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: go again does not leak to a second AAC and +1{p} is this-turn only", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [artOfWarYellow, snatchRed, brutalAssaultBlue, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 8,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(artOfWarYellow, { modeIndexes: [0, 1] });
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(0);

    Dash.endTurn();
    game.as(bravo).endTurn();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
