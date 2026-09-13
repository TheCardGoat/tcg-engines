import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { trotAlongBlue } from "./trot-along.ts";

describe("Trot Along (HNT240) AAA", () => {
  it("happy: the next attack with 3 or less base {p} gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [trotAlongBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(trotAlongBlue);
    game.helpers.resolveUntilIdle();
    Dori.activate(dawnblade);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Dori).toHaveAP(1);
  });

  it("boundary: an attack with more than 3 base {p} does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [trotAlongBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(trotAlongBlue);
    game.helpers.resolveUntilIdle();
    Dori.attackWith(brutalAssaultBlue);

    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dori).toHaveAP(0);
  });

  it("timing: a 1H Saber proxy with 2 base {p} gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [trotAlongBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.play(trotAlongBlue);
    game.helpers.resolveUntilIdle();
    Kassai.must.activate(cintariSaber);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kassai).toHaveAP(1);
  });
});
