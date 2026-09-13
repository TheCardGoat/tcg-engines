import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "./snatch.ts";
import { leadWithSpeedRed } from "./lead-with-speed.ts";

describe("lead-with-speed family AAA", () => {
  it("happy: next Brute or Warrior attack gets +3{p} and creates an Agility token", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [leadWithSpeedRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.play(leadWithSpeedRed);
    game.helpers.resolveUntilIdle();

    expect(Kassai.zone("arena")).toContain("token:agility");
    expectFabCard(Kassai, leadWithSpeedRed).toBeIn("graveyard");
    expectFabPlayer(Kassai).toHaveAP(1);

    Kassai.activateAttack(cintariSaber);

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a Generic attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [leadWithSpeedRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.play(leadWithSpeedRed);
    game.helpers.resolveUntilIdle();
    Kassai.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
    expect(Kassai.zone("arena")).toContain("token:agility");
    expect(Dash.zone("arena")).not.toContain("token:agility");
  });

  it("timing: Agility grants go again next turn and the +3{p} latch expires", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [leadWithSpeedRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.play(leadWithSpeedRed);
    game.helpers.resolveUntilIdle();
    Kassai.endTurn();
    game.helpers.untilIdle();
    expect(Kassai.zone("arena")).toContain("token:agility");

    Dash.endTurn();
    game.helpers.untilIdle();
    expect(Kassai.zone("arena")).not.toContain("token:agility");

    Kassai.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
  });
});
