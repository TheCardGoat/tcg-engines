import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";
import { drawSwordsRed } from "./draw-swords.ts";

/**
 * Draw Swords Red (HVY121) — Warrior Action.
 *
 * Printed:
 *   Your next Warrior attack this turn gets +3{p}.
 *   Draw a card.
 *   Go again.
 */

describe("draw-swords family AAA", () => {
  it("happy: draws a card and the next Warrior attack gets +3 power", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [drawSwordsRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: [brutalAssaultBlue, tomeOfFyendalYellow],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(drawSwordsRed);
    game.passBoth();

    expectFabCard(Kassai, tomeOfFyendalYellow).toBeIn("hand");
    expectFabCard(Kassai, drawSwordsRed).toBeIn("graveyard");

    Kassai.must.activate(cintariSaber);
    game.passBoth();

    // Cintari Saber base 2 + Draw Swords 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a non-Warrior attack does not get the power", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [drawSwordsRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [tomeOfFyendalYellow],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(drawSwordsRed);
    game.passBoth();
    Kassai.must.playAttack(snatchRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play Draw Swords", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [drawSwordsRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [tomeOfFyendalYellow],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    expectFabPlayer(Kassai).toHaveAP(1);
    Kassai.play(drawSwordsRed);
    game.passBoth();
    expectFabPlayer(Kassai).toHaveAP(1);
  });
});
