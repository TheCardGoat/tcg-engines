import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { blessingOfSavageryRed, blessingOfSavageryYellow } from "./blessing-of-savagery.ts";

describe("Blessing of Savagery (DYN013) AAA", () => {
  it("happy: next attack with 6 or more base {p} gets +3{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [blessingOfSavageryRed],
        hand: [commandAndConquerRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, blessingOfSavageryRed).toBeIn("graveyard");

    Bravo.playAttack(commandAndConquerRed, { pitch: [nimblismBlue, nimblismBlue] });
    expectCombat(game).toHaveAttackPower(9);
  });

  it("color variant: the yellow member grants +2{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [blessingOfSavageryYellow],
        hand: [commandAndConquerRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    Bravo.playAttack(commandAndConquerRed, { pitch: [nimblismBlue, nimblismBlue] });

    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a 4{p} attack does not get the bonus", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [blessingOfSavageryRed],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [blessingOfSavageryRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), blessingOfSavageryRed).toBeIn("arena");
  });
});
