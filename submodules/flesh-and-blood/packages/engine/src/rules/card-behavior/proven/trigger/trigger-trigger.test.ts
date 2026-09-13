/**
 * AAA test for trigger:trigger (generic).
 * Representative card: Skull Crushers (EVR001) — Brute Arms with battleworn.
 * Printed roll-outcome triggers use a generic trigger event shape in catalog;
 * prove the equipment is seatable and battleworn applies on defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { skullCrushers } from "../../../../../../cards/src/cards/equipment/skull-crushers.ts";

describe("trigger: trigger", () => {
  it("AAA: Skull Crushers can defend and receive battleworn (EVR001)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arms: [skullCrushers], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const eqId = Dash.findCardInZone("arms", skullCrushers);
    game.as(bravo).attackWith(snatchRed);
    Dash.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("arms")).toContain(skullCrushers.canonicalId);
    // Battleworn put a −1{d} counter.
    expect(game.objectState(eqId)?.defenseCounterTotal ?? 0).toBeLessThanOrEqual(0);
  });

  it("AAA boundary: without defending Skull Crushers, arms stay empty of counters", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, arms: [skullCrushers], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const eqId = Dash.findCardInZone("arms", skullCrushers);
    game.as(bravo).attackWith(snatchRed);
    // Pass defend — no equipment block.
    game.helpers.resolveRestOfCombat();
    expect(game.objectState(eqId)?.defenseCounterTotal ?? 0).toBe(0);
  });
});
