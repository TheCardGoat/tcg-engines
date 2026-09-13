import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { hocusPocusRed } from "./hocus-pocus.ts";

/**
 * Hocus Pocus (ROS143) — When this attacks, create a Runechant token.
 */

describe("Hocus Pocus (ROS143) AAA", () => {
  it("happy: attacking creates a Runechant token under the controller", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [hocusPocusRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(hocusPocusRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("runechant", 0);
  });

  it("boundary: a different attack does not mint this Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(brutalAssaultBlue, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
  });

  it("timing: the token exists at on-attack; combat stays open", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [hocusPocusRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(hocusPocusRed, { stopAt: "on-attack" });
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    expectCombat(game).toBeOpen();
  });
});
