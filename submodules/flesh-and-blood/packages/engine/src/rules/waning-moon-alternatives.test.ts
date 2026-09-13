import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dash, nimblismBlue, sigilOfSolaceRed } from "./fixtures.ts";
import { iyslander } from "../../../cards/src/cards/heroes/iyslander.ts";
import { waningMoon } from "../../../cards/src/cards/weapons/waning-moon.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Waning Moon alternative arcane damage", () => {
  it("AAA own-turn branch: a real non-attack action enables exactly two arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        weapon1: [waningMoon],
        resourcePoints: 2,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Iyslander.play(nimblismBlue);
    game.passBoth();
    Iyslander.activate(waningMoon);
    Iyslander.chooseTargetPlayers(Dash);
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(lifeBefore - 2);
  });

  it("AAA opponent-turn branch: an arsenal blue action enables exactly three arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: iyslander,
        weapon1: [waningMoon],
        resourcePoints: 2,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [nimblismBlue],
        deck: 4,
      },
      manual,
    );
    const Dash = game.as(dash);
    const Iyslander = game.as(iyslander);
    const lifeBefore = Dash.life();

    Dash.pass();
    Iyslander.playFromArsenal(nimblismBlue);
    game.passBoth();

    Dash.pass();
    Iyslander.activate(waningMoon);
    Iyslander.chooseTargetPlayers(Dash);
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(lifeBefore - 3);
  });
});
