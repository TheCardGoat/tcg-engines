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
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { bingoRed } from "./bingo.ts";

describe("Bingo (EVR156) AAA", () => {
  it("happy: attacks at printed 5{p} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [bingoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(bingoRed);
    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
  });

  it("boundary: a miss does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [bingoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed],
      },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
    );
    const Dash = game.as(dash);

    Dash.playAttack(bingoRed);
    game.as(bravo).defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, bingoRed).toBeIn("graveyard");
  });

  it("happy: hitting a hero who reveals a non-attack action draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [bingoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: bravo, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(bingoRed);
    game.closeCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(15);
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("boundary: revealing an attack action does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [bingoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(bingoRed);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveHandCount(0);
  });
});
