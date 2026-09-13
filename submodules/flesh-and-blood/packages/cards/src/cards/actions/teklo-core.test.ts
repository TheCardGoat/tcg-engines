import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { tekloCoreBlue } from "./teklo-core.ts";

/**
 * Teklo Core Blue (ARC007) — Mechanologist Item, Dash Specialization.
 *
 * Printed: Enters with 2 steam counters. When it has none, destroy it.
 * At the beginning of your action phase, remove a steam counter and gain {r}{r}.
 */

describe("Teklo Core (ARC007) AAA", () => {
  it("happy: enters with 2 steam and the next action phase removes 1 and gains {r}{r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tekloCoreBlue], actionPoints: 1, resourcePoints: 0, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(tekloCoreBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, tekloCoreBlue).toBeIn("arena").toHaveCounters(2, "steam");

    Dash.endTurn();
    game.as(bravo).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, tekloCoreBlue).toBeIn("arena").toHaveCounters(1, "steam");
    expectFabPlayer(Dash).toHaveResourceCount(2);
  });

  it("boundary: the opponent's action phase does not remove steam", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tekloCoreBlue], actionPoints: 1, resourcePoints: 0, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(tekloCoreBlue);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, tekloCoreBlue).toBeIn("arena").toHaveCounters(2, "steam");
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("timing: a second controller action phase removes the last steam and destroys this", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tekloCoreBlue], actionPoints: 1, resourcePoints: 0, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(tekloCoreBlue);
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, tekloCoreBlue).toHaveCounters(1, "steam");

    Dash.endTurn();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expect(Dash.cardsIn("arena", tekloCoreBlue)).toHaveLength(0);
  });
});
