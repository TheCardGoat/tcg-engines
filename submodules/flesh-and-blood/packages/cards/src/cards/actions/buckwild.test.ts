import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { colorsOfAriaRed } from "./colors-of-aria.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { buckwildRed } from "./buckwild.ts";

describe("Buckwild (SUP143) AAA", () => {
  it("happy: a 6+{p} card in pitch grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [buckwildRed],
        pitch: [colorsOfAriaRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(buckwildRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Rhinar, buckwildRed).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveAP(1);
  });

  it("boundary: a 4{p} pitch card does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [buckwildRed],
        pitch: [brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(buckwildRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveAP(0);
  });
});
