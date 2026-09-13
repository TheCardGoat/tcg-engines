import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { rustBelt } from "./rust-belt.ts";

/**
 * Rust Belt — Mechanologist Chest d1, Battleworn.
 *
 * Printed: "Instant - {t} a cog you control, destroy this: Gain {r}. Battleworn"
 */

describe("Rust Belt (AAA) AAA", () => {
  it("happy: tapping the cog and destroying the belt gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [rustBelt],
        arena: [goldenCog],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.activate(rustBelt);
    game.untilIdle();

    expectFabCard(Dash, rustBelt).toBeIn("graveyard");
    expectFabCard(Dash, goldenCog).toBeTapped();
    expectFabPlayer(Dash).toHaveResourceCount(2); // 1 + 1 gain
  });

  it("boundary: with no cog to tap the Instant cannot be activated", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [rustBelt],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(rustBelt);
    expectFabCard(Dash, rustBelt).toBeIn("chest");
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });
});
