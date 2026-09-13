import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { jiveBlue } from "./jive.ts";

/**
 * Jive — Warrior Action, cost 0 (blue).
 *
 * Printed: "Create a Blade Dance token."
 */

describe("Jive (MPW115) AAA", () => {
  it("happy: creates a Blade Dance token under your control and costs the action point", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, hand: [jiveBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(jiveBlue);
    game.untilIdle();

    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("blade-dance", 0);
    expectFabPlayer(Dori).toHaveAP(0);
  });

  it("boundary: the token is a true Blade Dance — the next weapon attack destroys it and gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [jiveBlue],
        weapon1: [dawnblade],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(jiveBlue);
    game.untilIdle();
    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 1);

    Dori.activate(dawnblade);
    game.passBoth();

    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 0);
    game.closeCombat({ optionals: "decline" });

    // Go again refunded the action point spent to activate Dawnblade.
    expectFabPlayer(Dori).toHaveAP(1);
  });
});
