import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { tomeOfFyendalYellow } from "./tome-of-fyendal.ts";

describe("Tome of Fyendal (WTR160) AAA", () => {
  it("happy: drawing 2 cards from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tomeOfFyendalYellow);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveHandCount(2);
    expectFabCard(Bravo, tomeOfFyendalYellow).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: from hand it does not gain life", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tomeOfFyendalYellow, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: [snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tomeOfFyendalYellow);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveHandCount(3);
  });

  it("timing: played from arsenal, gain 1{h} per card in hand after the draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue],
        arsenal: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: [snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tomeOfFyendalYellow, { from: "arsenal" });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveHandCount(3);
    expectFabPlayer(Bravo).toHaveLife(21);
    expect(game.combat()).toBeNull();
  });
});
