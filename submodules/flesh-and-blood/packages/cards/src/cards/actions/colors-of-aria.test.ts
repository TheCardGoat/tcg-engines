import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { colorsOfAriaRed } from "./colors-of-aria.ts";

describe("Colors of Aria (PEN206) AAA", () => {
  it("happy: while face-up this is Earth, Ice, and Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [colorsOfAriaRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(colorsOfAriaRed);
    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Briar, colorsOfAriaRed).toHaveSupertype("Earth");
    expectFabCard(Briar, colorsOfAriaRed).toHaveSupertype("Ice");
    expectFabCard(Briar, colorsOfAriaRed).toHaveSupertype("Lightning");
  });

  it("boundary: a face-down arsenal copy is not Earth, Ice, or Lightning", () => {
    const game = FabTestEngine.start(
      { hero: briar, arsenal: [colorsOfAriaRed], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    expectFabCard(Briar, colorsOfAriaRed).notToHaveSupertype("Earth");
    expectFabCard(Briar, colorsOfAriaRed).notToHaveSupertype("Ice");
    expectFabCard(Briar, colorsOfAriaRed).notToHaveSupertype("Lightning");
    expectFabCard(Briar, colorsOfAriaRed).toBeFaceDown();
  });

  it("timing: face-up in the graveyard still has Earth, Ice, and Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [colorsOfAriaRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(colorsOfAriaRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
    expectFabCard(Briar, colorsOfAriaRed).toHaveSupertype("Earth");
    expectFabCard(Briar, colorsOfAriaRed).toHaveSupertype("Ice");
    expectFabCard(Briar, colorsOfAriaRed).toHaveSupertype("Lightning");
  });
});
