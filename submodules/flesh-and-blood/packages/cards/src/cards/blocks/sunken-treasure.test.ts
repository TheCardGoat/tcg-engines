import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { sunkenTreasureBlue } from "./sunken-treasure.ts";

describe("Sunken Treasure (SEA133) AAA", () => {
  it("happy: defending may turn a yellow graveyard card face-down and create a Gold", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [sunkenTreasureBlue],
        graveyard: [tomeOfFyendalYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    Dash.defendWith(sunkenTreasureBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Dash, tomeOfFyendalYellow).toBeFaceDown();
    expect(Dash.zone("arena")).toContain("token:gold");
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [sunkenTreasureBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(sunkenTreasureBlue)).toThrow();
    expectFabCard(game.as(dash), sunkenTreasureBlue).toBeIn("hand");
  });
});
