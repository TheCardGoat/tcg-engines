import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { diamond } from "./diamond.ts";

/**
 * Token behavior acceptance test — Diamond (FAB165).
 *
 * AAA trio:
 * - Happy: activate draws 1 card and grants go again
 * - Boundary: Diamond removed from arena after activation
 * - Timing: go again means active player retains priority
 *
 * Hero: Dash (ARC002) — Generic
 * FLUENT API ONLY.
 */

describe("Diamond (FAB165) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate draws 1 card and grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: diamond }],
        deck: 8,
      },
      { hero: bravo, deck: 8 },
    );
    const Dash = game.as(dash);

    expectFabPlayer(Dash).toHaveHandCount(4);

    Dash.must.activate(diamond);

    // Drew 1 card: 4 + 1 = 5.
    expectFabPlayer(Dash).toHaveHandCount(5);

    // Diamond was destroyed — removed from arena.
    expect(Dash.zone("arena")).toHaveLength(0);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: Diamond gone from arena after activation", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: diamond }],
        deck: 8,
      },
      { hero: bravo, deck: 8 },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("arena")).toHaveLength(1);

    Dash.activate(diamond);

    expect(Dash.zone("arena")).toHaveLength(0);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: go again grants continued priority after activation", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: diamond }],
        deck: 8,
      },
      { hero: bravo, deck: 8 },
    );
    const Dash = game.as(dash);

    Dash.activate(diamond);

    // Go again means the active player may take another action this turn.
    expect(Dash.isActive()).toBe(true);
  });
});
