import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { victorGoldmane } from "../heroes/victor-goldmane.ts";
import { visitGoldmaneEstateBlue } from "./visit-goldmane-estate.ts";

/**
 * Visit Goldmane Estate (MST225) — Guardian Action, cost 1, go again.
 * Victor Specialization (constructed-only; 1v1 seats Victor).
 *
 * Printed: Create a Gold token. Then if you control 3 or more Gold, create
 * that many Might tokens. Go again.
 */

describe("Visit Goldmane Estate (MST225) AAA", () => {
  it("happy: creating a third Gold then creates 3 Might", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        hand: [visitGoldmaneEstateBlue],
        arena: [fabToken("gold"), fabToken("gold")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);

    Victor.play(visitGoldmaneEstateBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Victor).toHaveTokenCount("gold", 3);
    expectFabPlayer(Victor).toHaveTokenCount("might", 3);
  });

  it("boundary: with fewer than 3 Gold after the mint, creates no Might", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        hand: [visitGoldmaneEstateBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);

    Victor.play(visitGoldmaneEstateBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Victor).toHaveTokenCount("gold", 1);
    expectFabPlayer(Victor).toHaveTokenCount("might", 0);
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        hand: [visitGoldmaneEstateBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);

    Victor.play(visitGoldmaneEstateBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Victor).toHaveAP(1);
  });
});
