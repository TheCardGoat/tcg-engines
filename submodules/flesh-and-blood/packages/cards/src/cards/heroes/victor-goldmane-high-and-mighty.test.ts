import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { visitGoldmaneEstateBlue } from "../actions/visit-goldmane-estate.ts";
import { victorGoldmaneHighAndMighty } from "./victor-goldmane-high-and-mighty.ts";

describe("Victor Goldmane, High and Mighty (HVY047) AAA", () => {
  it("happy: the first Gold created from an effect you control draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneHighAndMighty,
        hand: [visitGoldmaneEstateBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneHighAndMighty);

    Victor.play(visitGoldmaneEstateBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Victor).toHaveHandCount(1);
    expectFabPlayer(Victor).toHaveTokenCount("gold", 1);
  });

  it("boundary: a second Gold create the same turn does not draw again", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneHighAndMighty,
        hand: [visitGoldmaneEstateBlue, visitGoldmaneEstateBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneHighAndMighty);

    Victor.play(visitGoldmaneEstateBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Victor).toHaveHandCount(2);
    Victor.play(visitGoldmaneEstateBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Victor).toHaveHandCount(1);
    expectFabPlayer(Victor).toHaveTokenCount("gold", 2);
  });

  it("timing: a Gold you already control does not count as creating this turn", () => {
    const gold = fabToken("gold");
    const game = FabTestEngine.start(
      {
        hero: victorGoldmaneHighAndMighty,
        hand: [visitGoldmaneEstateBlue],
        arena: [gold],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmaneHighAndMighty);

    Victor.play(visitGoldmaneEstateBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Victor).toHaveHandCount(1);
    expectFabPlayer(Victor).toHaveTokenCount("gold", 2);
  });
});
