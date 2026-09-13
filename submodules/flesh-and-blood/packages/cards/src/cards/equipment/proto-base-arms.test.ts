import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { protoBaseArms } from "./proto-base-arms.ts";

/**
 * Proto Base Arms (TCC005) — Mechanologist Equipment - Base Arms.
 *
 * Printed: (vanilla — no abilities, no printed stats)
 *
 * AAA trio:
 * - Happy: seats in the arms slot at game start.
 * - Boundary: no activated abilities and no printed defense — cannot be
 *   activated or declared as a defender.
 * - Timing: equipment persists across a full turn cycle.
 */

describe("Proto Base Arms (TCC005) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: seats in the arms slot at game start", () => {
    const game = FabTestEngine.start(
      { hero: dash, arms: [protoBaseArms], deck: 6 },
      { hero: oldhimGrandfatherOfEternity, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(Dash.zone("arms")).toHaveLength(1);
    expect(Dash.zone("arms")).toContain(protoBaseArms.canonicalId);
    expectFabCard(Dash, protoBaseArms).toBeIn("arms");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no abilities and no defense — cannot be activated or declared as a defender", () => {
    const game = FabTestEngine.start(
      { hero: dash, arms: [protoBaseArms], actionPoints: 1, deck: 6 },
      { hero: oldhimGrandfatherOfEternity, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.activate(protoBaseArms)).toThrow();
    expect(() => Dash.defendWith(protoBaseArms)).toThrow();
    expectFabCard(Dash, protoBaseArms).toBeIn("arms");
  });

  // ── Timing / persistence ───────────────────────────────────────────────────

  it("timing: equipment persists across a full turn cycle", () => {
    const game = FabTestEngine.start(
      { hero: dash, arms: [protoBaseArms], deck: 6 },
      { hero: oldhimGrandfatherOfEternity, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Dash.endTurn();
    Oldhim.endTurn();

    expect(Dash.zone("arms")).toHaveLength(1);
    expect(Dash.zone("arms")).toContain(protoBaseArms.canonicalId);
  });
});
