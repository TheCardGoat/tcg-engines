import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { talismanOfBalanceBlue } from "./talisman-of-balance.ts";

describe("Talisman of Balance (EVR188) AAA", () => {
  it("happy: end phase destroys this and arsenals the top of your deck when you have fewer arsenal cards", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [talismanOfBalanceBlue],
        hand: [],
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [], arsenal: [talismanOfBalanceBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, talismanOfBalanceBlue).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
  });

  it("boundary: equal arsenal counts leave this in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [talismanOfBalanceBlue],
        hand: [],
        deck: [nimblismBlue],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, talismanOfBalanceBlue).toBeIn("arena");
  });

  it("timing: playing the Action puts the item in the arena with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [talismanOfBalanceBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(talismanOfBalanceBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, talismanOfBalanceBlue).toBeIn("arena");
    expect(Dash.actionPoints()).toBe(1);
  });
});
