import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { forTheEmperorRed } from "./for-the-emperor.ts";

/**
 * For the Emperor (HNT159) — When this attacks a marked hero, create a Fealty token.
 */

describe("For the Emperor (HNT159) AAA", () => {
  it("happy: attacking a marked hero creates a Fealty token", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [forTheEmperorRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, marked: true, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(forTheEmperorRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("fealty", 0);
  });

  it("boundary: attacking an unmarked hero does not create Fealty", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [forTheEmperorRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(forTheEmperorRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 0);
  });

  it("boundary: a different attack does not mint this Fealty", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, marked: true, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.playAttack(brutalAssaultBlue, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 0);
  });
});
