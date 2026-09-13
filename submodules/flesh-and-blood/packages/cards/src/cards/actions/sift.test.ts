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
import { siftRed } from "./sift.ts";

describe("Sift (UPR197) AAA", () => {
  it("happy: putting 2 cards on the bottom draws 2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [siftRed, nimblismBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(siftRed);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expectFabPlayer(Bravo).toHaveHandCount(2);
    expectFabCard(Bravo, siftRed).toBeIn("graveyard");
  });

  it("boundary: 0 leftover AP cannot play this Action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [siftRed, nimblismBlue],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).play(siftRed)).toThrow();
    expectFabCard(game.as(bravo), siftRed).toBeIn("hand");
  });

  it("timing: putting 0 cards on the bottom draws 0 and does not open combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [siftRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(siftRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveHandCount(0);
    expect(game.combat()).toBeNull();
  });
});
