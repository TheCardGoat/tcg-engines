import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { dissipationShieldYellow } from "./dissipation-shield.ts";

/**
 * Dissipation Shield Yellow (ARC035) — Mechanologist Item.
 *
 * Printed: Enters with 4 steam counters. At the beginning of your action
 * phase, destroy this unless you remove a steam counter from it.
 */

describe("Dissipation Shield (ARC035) AAA", () => {
  it("happy: enters with 4 steam and keeping it at action-phase start spends 1", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [dissipationShieldYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(dissipationShieldYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, dissipationShieldYellow).toBeIn("arena").toHaveCounters(4, "steam");

    Dash.endTurn();
    game.as(bravo).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Dash, dissipationShieldYellow).toBeIn("arena").toHaveCounters(3, "steam");
  });

  it("boundary: declining the action-phase unless destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [dissipationShieldYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(dissipationShieldYellow);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.as(bravo).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Dash.cardsIn("arena", dissipationShieldYellow)).toHaveLength(0);
  });

  it("timing: the opponent's action phase does not ask to remove steam", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [dissipationShieldYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(dissipationShieldYellow);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, dissipationShieldYellow).toBeIn("arena").toHaveCounters(4, "steam");
  });
});
