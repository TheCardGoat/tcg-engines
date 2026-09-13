import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { hotStreak } from "../weapons/hot-streak.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { bluntenYellow } from "./blunten.ts";

describe("Blunten (PEN049) AAA", () => {
  it("happy: defends a weapon attack and the attacking hero discards a card", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [hotStreak],
        hand: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [bluntenYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activate(hotStreak);
    game.passBoth();
    game.advanceCombatTo("defend");
    Dash.defendWith(bluntenYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Kassai, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, bluntenYellow).toBeIn("graveyard");
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [bluntenYellow], deck: 6 },
      { hero: kassai, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(bluntenYellow)).toThrow();
    expectFabCard(game.as(dash), bluntenYellow).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveHandCount(1);
  });
});
