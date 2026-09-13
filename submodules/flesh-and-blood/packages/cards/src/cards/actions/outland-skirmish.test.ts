import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kassai } from "../heroes/kassai.ts";
import { dash } from "../heroes/dash.ts";
import { parryBlade } from "../equipment/parry-blade.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { outlandSkirmishRed } from "./outland-skirmish.ts";

describe("Outland Skirmish (EVR066) AAA", () => {
  it("happy: the next 1H weapon attack gains +3{p} and a hit creates Copper", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [parryBlade],
        hand: [outlandSkirmishRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.play(outlandSkirmishRed);
    game.helpers.resolveUntilIdle();
    Kassai.activate(parryBlade);
    game.passBoth();

    // Parry Blade base 2 + 3.
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expect(Kassai.zone("arena")).toContain("token:copper");
  });

  it("boundary: a non-1H-weapon attack gets no +3{p} and creates no Copper", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [outlandSkirmishRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.play(outlandSkirmishRed);
    game.helpers.resolveUntilIdle();
    Kassai.attackWith(brutalAssaultBlue);

    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();
    expect(Kassai.zone("arena")).not.toContain("token:copper");
  });

  it("timing: go again refunds the action point spent to play the Skirmish", () => {
    const game = FabTestEngine.start(
      { hero: kassai, hand: [outlandSkirmishRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    expect(Kassai.actionPoints()).toBe(1);
    Kassai.play(outlandSkirmishRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kassai).toHaveAP(1);
  });
});
