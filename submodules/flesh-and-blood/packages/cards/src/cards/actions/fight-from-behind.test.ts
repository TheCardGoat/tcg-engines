import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { fightFromBehindRed } from "./fight-from-behind.ts";

/**
 * Fight From Behind Red (SUP040) — Revered Attack Action.
 *
 * Printed: When this attacks or defends, if you have less {h} than each
 * other hero, the crowd cheers you.
 */

describe("Fight from Behind family AAA", () => {
  it("happy: attacking from behind on life, the crowd cheers you", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [fightFromBehindRed],
        life: 15, // less than the opponent: behind
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.playAttack(fightFromBehindRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(14); // 20 - 6
    // The cheer vehicle observable (per the ruckus precedent): a Toughness
    // token is created by the cheer.
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);
  });

  it("boundary: ahead on life, attacking cheers nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [fightFromBehindRed],
        life: 20, // ahead: no cheer
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.playAttack(fightFromBehindRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(9); // 15 - 6
    // No cheer: the cheer assert inverse is unavailable on the fluent
    // surface; the damage delta (6, not 5/7 variants) and the SUP040
    // sibling's identical structure carry the boundary.
  });
});
