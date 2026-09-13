import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { unboundByShadowRed } from "./unbound-by-shadow.ts";

/**
 * Unbound by Shadow (IAR178) — When this attacks, if it was played from your
 * banished zone, create a Gate to i'Arathael token.
 */

describe("Unbound by Shadow (IAR178) AAA", () => {
  it("happy: Gate permission then attacking from banished creates a Gate token", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [unboundByShadowRed],
        arena: [fabToken("gate-to-i-arathael")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.activate(fabToken("gate-to-i-arathael"));
    Chane.target(unboundByShadowRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    Chane.playAttack(unboundByShadowRed, { from: "banished", stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("gate-to-i-arathael", 0);
  });

  it("boundary: playing from hand does not create the Gate", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [unboundByShadowRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(unboundByShadowRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 0);
  });

  it("timing: the token exists at on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [unboundByShadowRed],
        arena: [fabToken("gate-to-i-arathael")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.activate(fabToken("gate-to-i-arathael"));
    Chane.target(unboundByShadowRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    Chane.playAttack(unboundByShadowRed, { from: "banished", stopAt: "on-attack" });
    expectFabPlayer(Chane).toHaveTokenCount("gate-to-i-arathael", 1);
  });
});
