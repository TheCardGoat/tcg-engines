import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { bucklingBlowBlue } from "./buckling-blow.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { crashDownRed } from "./crash-down.ts";
import { crashDownYellow } from "./crash-down.ts";

describe("Crash Down (TCC037) AAA", () => {
  it("happy: start-of-turn destroy then next Guardian AAC gets +6{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 40, deck: 6 },
      {
        hero: bravo,
        arena: [crashDownRed],
        hand: [bucklingBlowBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, crashDownRed).toBeIn("graveyard");
    Bravo.playAttack(bucklingBlowBlue);
    expectCombat(game).toHaveAttackPower(12);
  });

  it("boundary: a Generic AAC does not get +6{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 40, deck: 6 },
      {
        hero: bravo,
        arena: [crashDownRed],
        hand: [brutalAssaultBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    Bravo.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [crashDownRed],
        hand: [bucklingBlowBlue],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), crashDownRed).toBeIn("arena");
  });
});

describe("Crash Down (TCC042) AAA", () => {
  it("happy: start-of-turn destroy then next Guardian AAC gets +5{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 40, deck: 6 },
      {
        hero: bravo,
        arena: [crashDownYellow],
        hand: [bucklingBlowBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, crashDownYellow).toBeIn("graveyard");
    Bravo.playAttack(bucklingBlowBlue);
    expectCombat(game).toHaveAttackPower(11);
  });

  it("boundary: a Generic AAC does not get +5{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 40, deck: 6 },
      {
        hero: bravo,
        arena: [crashDownYellow],
        hand: [brutalAssaultBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    Bravo.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [crashDownYellow],
        hand: [bucklingBlowBlue],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), crashDownYellow).toBeIn("arena");
  });
});
