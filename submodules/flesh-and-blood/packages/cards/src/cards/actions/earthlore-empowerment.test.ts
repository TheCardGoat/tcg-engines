import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { bucklingBlowBlue } from "./buckling-blow.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { earthloreEmpowermentRed } from "./earthlore-empowerment.ts";
import { earthloreEmpowermentYellow } from "./earthlore-empowerment.ts";

describe("Earthlore Empowerment (TCC038) AAA", () => {
  it("happy: start-of-turn destroy then next Guardian AAC costs {r} less and gets +5{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 40, deck: 6 },
      {
        hero: bravo,
        arena: [earthloreEmpowermentRed],
        hand: [bucklingBlowBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, earthloreEmpowermentRed).toBeIn("graveyard");
    Bravo.playAttack(bucklingBlowBlue);
    expectCombat(game).toHaveAttackPower(11);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: a Generic AAC does not get +5{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 40, deck: 6 },
      {
        hero: bravo,
        arena: [earthloreEmpowermentRed],
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
        arena: [earthloreEmpowermentRed],
        hand: [bucklingBlowBlue],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), earthloreEmpowermentRed).toBeIn("arena");
  });
});

describe("Earthlore Empowerment (TCC043) AAA", () => {
  it("happy: start-of-turn destroy then next Guardian AAC costs {r} less and gets +4{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 40, deck: 6 },
      {
        hero: bravo,
        arena: [earthloreEmpowermentYellow],
        hand: [bucklingBlowBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, earthloreEmpowermentYellow).toBeIn("graveyard");
    Bravo.playAttack(bucklingBlowBlue);
    expectCombat(game).toHaveAttackPower(10);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: a Generic AAC does not get +4{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 40, deck: 6 },
      {
        hero: bravo,
        arena: [earthloreEmpowermentYellow],
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
        arena: [earthloreEmpowermentYellow],
        hand: [bucklingBlowBlue],
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), earthloreEmpowermentYellow).toBeIn("arena");
  });
});
