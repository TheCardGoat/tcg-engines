/**
 * AAA test for trigger:go-again.
 * Representative card: Dorinthea Quicksilver Prodigy (DVR001).
 * First Dawnblade Resplendent go-again each turn may allow an additional attack.
 * Production emits go-again when an attack with go again resolves damage.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, snatchRed, dawnblade } from "../../../fixtures.ts";
import { dorintheaQuicksilverProdigy } from "../../../../../../cards/src/cards/heroes/dorinthea-quicksilver-prodigy.ts";
import { scourTheBattlescapeRed } from "../../../fixtures.ts";

describe("trigger: go-again", () => {
  it("AAA: an attack with go again grants an action point after combat (CR 7.5)", () => {
    // Prove go-again event production via AP retention after a go-again attack.
    const game = FabTestEngine.start(
      {
        hero: dorintheaQuicksilverProdigy,
        weapon1: [dawnblade],
        arsenal: [scourTheBattlescapeRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dori = game.as(dorintheaQuicksilverProdigy);
    Dori.play(scourTheBattlescapeRed, { target: game.as(dash).id, from: "arsenal" });
    game.helpers.resolveRestOfCombat();
    // Go again restores 1 AP after the attack resolves.
    expect(Dori.actionPoints()).toBeGreaterThanOrEqual(1);
  });

  it("AAA boundary: attack without go again does not restore AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dorintheaQuicksilverProdigy,
        hand: [snatchRed],
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dori = game.as(dorintheaQuicksilverProdigy);
    Dori.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Dori.actionPoints()).toBe(0);
  });
});
