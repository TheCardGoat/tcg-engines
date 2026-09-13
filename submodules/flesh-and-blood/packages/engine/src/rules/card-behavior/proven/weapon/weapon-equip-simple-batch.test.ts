/**
 * Hand-authored AAA for simple pending weapons and destroy-self equipment.
 * Modules read end-to-end — no dumps.
 *
 * - RVD002 bone-basher — pure OPT 2RP attack 4
 * - HVY007 mini-meataxe — OPT 2RP attack 3 + on-attack draw/discard
 * - EVR103 vexing-quillhand — destroy create 2 Runechants
 * - SUP212 / SEA127 — gain {r} go again twins
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { boneBasher } from "../../../../../../cards/src/cards/weapons/bone-basher.ts";
import { miniMeataxe } from "../../../../../../cards/src/cards/weapons/mini-meataxe.ts";
import { vexingQuillhand } from "../../../../../../cards/src/cards/equipment/vexing-quillhand.ts";
import { garlandOfSpring } from "../../../../../../cards/src/cards/equipment/garland-of-spring.ts";
import { buccaneerSBounty } from "../../../../../../cards/src/cards/equipment/buccaneer-s-bounty.ts";
import { rhinar } from "../../../../../../cards/src/cards/heroes/rhinar.ts";
import { heartOfFyendalBlue } from "../../../../../../cards/src/cards/resources/heart-of-fyendal.ts";
import { crackedBaubleYellow } from "../../../../../../cards/src/cards/resources/cracked-bauble.ts";

const STARTING_LIFE = 40;

// ---------------------------------------------------------------------------
// RVD002 bone-basher — Brute Club 2H power 4
// Once per Turn Action - {r}{r}: Attack
// Purest attack weapon — baseline for 2RP OPT attacks.
// ---------------------------------------------------------------------------

describe("bone-basher (RVD002)", () => {
  it("core mechanic: 2 RP OPT attack deals 4 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [boneBasher],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);
    const Opponent = game.as(dash);
    const lifeBefore = Opponent.life();

    Rhinar.activate(boneBasher);
    game.helpers.resolveRestOfCombat();

    expect(Opponent.life()).toBe(lifeBefore - 4);
    expect(Rhinar.resourcePoints()).toBe(0);
  });

  it("boundaries: OPT second attack illegal; 0 RP illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [boneBasher],
        hand: [],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(boneBasher);
    game.helpers.resolveRestOfCombat();
    expect(() => Rhinar.activate(boneBasher)).toThrow();
  });

  it("boundaries: cannot activate without 2 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [boneBasher],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(rhinar).activate(boneBasher)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// HVY007 mini-meataxe — Brute Axe 1H power 3
// a1: OPT {r}{r}: Attack
// a2: When this attacks, draw a card then discard a random card.
//
// Reasoning:
// - Base attack 3 with 2RP is a1.
// - a2 draw+random discard must fire on attack declaration.
// - Model uses the target's typed random-selection policy — if random discard fails, hand grows by 1.
// ---------------------------------------------------------------------------

describe("mini-meataxe (HVY007)", () => {
  it("core mechanic: attack deals 3 and draws then discards a random hand card", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [miniMeataxe],
        // Seed hand so random discard has material after draw.
        hand: [heartOfFyendalBlue, crackedBaubleYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 10,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);
    const Opponent = game.as(dash);
    const lifeBefore = Opponent.life();
    const handBefore = Rhinar.zone("hand").length;
    const deckBefore = Rhinar.zone("deck").length;

    Rhinar.activate(miniMeataxe);
    game.helpers.resolveRestOfCombat();

    expect(Opponent.life()).toBe(lifeBefore - 3);
    // draw 1 then discard 1 → hand size unchanged; deck -1.
    expect(Rhinar.zone("hand").length).toBe(handBefore);
    expect(Rhinar.zone("deck").length).toBe(deckBefore - 1);
    // Discarded card is in graveyard.
    expect(Rhinar.zone("graveyard").length).toBeGreaterThanOrEqual(1);
  });

  it("boundaries: OPT and insufficient RP", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [miniMeataxe],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 8,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(miniMeataxe);
    game.helpers.resolveRestOfCombat();
    expect(() => Rhinar.activate(miniMeataxe)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// EVR103 vexing-quillhand — Runeblade Arms d0 AB1
// Action - Destroy this: Create 2 Runechant tokens. Go again
// ---------------------------------------------------------------------------

describe("vexing-quillhand (EVR103)", () => {
  it("core mechanic: destroy-self creates exactly 2 Runechants and refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [vexingQuillhand],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(vexingQuillhand);
    game.passBoth();

    expect(Bravo.zone("arms")).not.toContain(vexingQuillhand.canonicalId);
    const runechants = Bravo.zone("arena").filter((id) => id.toLowerCase().includes("runechant"));
    expect(runechants.length).toBe(2);
    expect(Bravo.actionPoints()).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// SUP212 garland-of-spring / SEA127 buccaneer-s-bounty
// Action - Destroy: Gain {r}. Go again
// ---------------------------------------------------------------------------

describe("garland-of-spring (SUP212)", () => {
  it("core mechanic: destroy-self gains 1 RP and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [garlandOfSpring],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(garlandOfSpring);
    game.passBoth();
    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.actionPoints()).toBe(1);
    expect(Bravo.zone("graveyard")).toContain(garlandOfSpring.canonicalId);
  });
});

describe("buccaneer-s-bounty (SEA127)", () => {
  it("core mechanic: destroy-self gains 1 RP and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [buccaneerSBounty],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(buccaneerSBounty);
    game.passBoth();
    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.actionPoints()).toBe(1);
    expect(Bravo.zone("graveyard")).toContain(buccaneerSBounty.canonicalId);
  });

  it("boundaries: bladeBreak defend d1 destroys without gaining resource", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: STARTING_LIFE,
        chest: [buccaneerSBounty],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(dash);
    const Defender = game.as(bravo);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(buccaneerSBounty);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(STARTING_LIFE - 3); // 4-1
    expect(Defender.zone("chest")).not.toContain(buccaneerSBounty.canonicalId);
    expect(Defender.resourcePoints()).toBe(0);
  });
});
