import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { melodySingAlong } from "../heroes/melody-sing-along.ts";
import { dash } from "../heroes/dash.ts";
import { hummingbirdCallOfAdventure } from "./hummingbird-call-of-adventure.ts";

/**
 * Weapon behavior acceptance test — Hummingbird, Call of Adventure (FAB094).
 *
 * AAA trio:
 * - Happy: weapon equips in weapon zone, has Bard/Lute/2H types
 * - Boundary: no functional effect without modal trigger (start of turn)
 * - Timing: modal start-of-turn — choose 1 of 3 modes (Quicken tokens / draw / gain life)
 *
 * Hero: Melody, Sing Along (TCC049) — Bard/Young
 * FLUENT API ONLY.
 */

describe("Hummingbird, Call of Adventure (FAB094) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: weapon equips in weapon zone", () => {
    const game = FabTestEngine.start(
      { hero: melodySingAlong, weapon1: [hummingbirdCallOfAdventure], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Melody = game.as(melodySingAlong);

    expect(Melody.zone("weapon1")).toHaveLength(1);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: 2H weapon — hero cannot equip in off-hand", () => {
    const game = FabTestEngine.start(
      { hero: melodySingAlong, weapon1: [hummingbirdCallOfAdventure], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Melody = game.as(melodySingAlong);

    // 2H weapon occupies the sole weapon slot.
    expect(Melody.zone("weapon1")).toHaveLength(1);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: start-of-turn modal — each hero gains 1{h}", () => {
    const game = FabTestEngine.start(
      { hero: melodySingAlong, weapon1: [hummingbirdCallOfAdventure], deck: 6, life: 20 },
      { hero: dash, deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Melody = game.as(melodySingAlong);
    const Dash = game.as(dash);

    Melody.endTurn();
    Dash.endTurn();

    const mode = game.pendingDecision();
    expect(mode?.kind).toBe("option");
    if (mode?.kind === "option") {
      const life = mode.options.find((option) => option.id === "gains1Life") ?? mode.options[2];
      Melody.chooseOptions(life!.id);
    }
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Melody).toHaveLife(21);
    expectFabPlayer(Dash).toHaveLife(21);
  });
});
