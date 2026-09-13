import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggy } from "../heroes/zyggy.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nebulusCycleYellow } from "./nebulus-cycle.ts";

/**
 * Nebulus Cycle Yellow (OMN035) — Lightning Illusionist Instant Aura.
 *
 * Printed: Ward 2. When this leaves the arena, create a Ponder token.
 */

describe("Nebulus (OMN035) AAA", () => {
  it("happy: playing this enters the arena with Ward 2", () => {
    const game = FabTestEngine.start(
      { hero: zyggy, hand: [nebulusCycleYellow], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.play(nebulusCycleYellow);
    game.passBoth();

    expectFabCard(Zyggy, nebulusCycleYellow).toBeIn("arena");
    expectFabCard(Zyggy, nebulusCycleYellow).toHaveKeyword("ward");
  });

  it("boundary: Ward 2 prevents 2 from Snatch, then leave-arena creates Ponder", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zyggy,
        arena: [nebulusCycleYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggy);

    Dash.attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Zyggy.zone("arena")).toContain("token:ponder");
    expectFabPlayer(Zyggy).toHaveLife(18);
  });

  it("timing: Ponder is created on leave-arena, not when Nebulus enters", () => {
    const game = FabTestEngine.start(
      { hero: zyggy, hand: [nebulusCycleYellow], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.play(nebulusCycleYellow);
    game.passBoth();

    expectFabCard(Zyggy, nebulusCycleYellow).toBeIn("arena");
    expect(Zyggy.zone("arena")).not.toContain("token:ponder");
  });
});
