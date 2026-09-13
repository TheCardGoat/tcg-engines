import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bloodiedShield } from "./bloodied-shield.ts";

/**
 * Bloodied Shield (SMP018) — Event Equipment - Off-Hand.
 *
 * Printed: "You may equip this.\nBlade Break"
 *
 * The optional event-window "You may equip this" leg has no in-match runtime
 * (same 1v1 out-of-scope as Bloodied Helm SMP014). Blade Break is the
 * operative in-match clause.
 */

describe("Bloodied Shield (SMP018) AAA", () => {
  it("setup boundary: seats in the off-hand slot with its printed defense", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon2: [bloodiedShield], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("weapon2")).toHaveLength(1);
    expectFabCard(Bravo, bloodiedShield).toHaveDefense(2);
  });

  it("boundary: no activated abilities — the seated shield cannot be activated", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon2: [bloodiedShield], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(bloodiedShield)).toThrow();
  });

  it("timing: defending with it spends its 2{d} and Blade Break destroys it after the chain link", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, weapon2: [bloodiedShield], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    Bravo.defendWith(bloodiedShield);
    game.helpers.resolveRestOfCombat();

    // 4{p} snatch reduced by the 2{d} block leaves 2 damage.
    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, bloodiedShield).toBeIn("graveyard");
    expect(Bravo.zone("weapon2")).not.toContain(bloodiedShield.canonicalId);
  });
});
