import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { snatchRed } from "./snatch.ts";
import { disperseBlue } from "./disperse.ts";

/**
 * Disperse (SUP032) — When this attacks, if you've been cheered this turn, create a Toughness token.
 */

describe("Disperse (SUP032) AAA", () => {
  it("happy: after being cheered this turn, attacking creates a Toughness token", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [disperseBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, alphaRampageRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.activate(tuffnut);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    const before = Tuffnut.zone("arena").filter((id) => id === "token:toughness").length;

    Tuffnut.playAttack(disperseBlue, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", before + 1);
  });

  it("boundary: without a cheer this turn, attacking creates no Toughness", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [disperseBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(disperseBlue, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
  });

  it("timing: the token exists at on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [disperseBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, alphaRampageRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.activate(tuffnut);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    const before = Tuffnut.zone("arena").filter((id) => id === "token:toughness").length;
    Tuffnut.playAttack(disperseBlue, { stopAt: "on-attack" });
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", before + 1);
  });
});
