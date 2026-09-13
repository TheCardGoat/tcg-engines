/**
 * CR 8.5.35a / 8.5.53b / 8.5.54b — equip-on-control-change.
 *
 * When an equipped object changes controller (gain-control / give / steal), it
 * is RE-EQUIPPED by the new controller as part of the move; if the matching
 * seat is occupied, the effect FAILS.
 *
 * No printed card steals/gives equipment (all steal cards target Gold tokens,
 * Items, Auras, or Allies), so these tests use justified synthetic trainers
 * per test-trainers.ts POLICY. The real-card non-equipment control-change
 * regression is covered by the existing equipment-gold-baited-hook + Smash and
 * Grab coverage (Items/tokens route through the arena path, unchanged).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import {
  bravo,
  dash,
  heartOfFyendal,
  ironrotHelm,
  nullruneHood,
  parryBlade,
} from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

const manualOpts = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

const stealHeadEquip = {
  type: "steal" as const,
  target: {
    selector: "object" as const,
    declared: "at-resolution" as const,
    player: "opponent" as const,
    zones: ["equipment-head" as const],
    count: 1,
  },
  controller: "controller" as const,
};

describe("CR 8.5.54b — equip-on-steal: re-equip to the new controller, fail if occupied", () => {
  it("steals an opponent's Head equipment into the thief's empty Head slot", () => {
    const attack = hitTrainer({ slug: "fx-steal-head-equip", power: 4, effect: stealHeadEquip });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 4 },
      { hero: dash, head: [ironrotHelm], deck: 4 },
      manualOpts,
    );

    expect(game.as(dash).zone("head").length).toBe(1);
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // CR 8.5.35a: the Head equipment was re-equipped to the thief's head slot.
    expect(game.as(bravo).zone("head").length).toBe(1);
    expect(game.as(dash).zone("head").length).toBe(0);
  });

  it("fails the steal when the thief's Head slot is already occupied (8.5.54b)", () => {
    const attack = hitTrainer({ slug: "fx-steal-head-occupied", power: 4, effect: stealHeadEquip });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], head: [nullruneHood], deck: 4 },
      { hero: dash, head: [ironrotHelm], deck: 4 },
      manualOpts,
    );

    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // CR 8.5.54b: thief's Head slot is occupied → steal failed; both players
    // keep their own Head equipment.
    expect(game.as(bravo).zone("head").length).toBe(1);
    expect(game.as(dash).zone("head").length).toBe(1);
  });

  it("steals two weapons into distinct seats (no double-booking across multi-target control-change)", () => {
    // A multi-target steal of two weapons must thread claimed-seat tracking so
    // the second weapon resolves to weapon2, not the same weapon1 the first
    // just took (both read the pre-loop state). parryBlade is 1H, so two fit.
    const stealTwoWeapons = {
      type: "steal" as const,
      target: {
        selector: "object" as const,
        declared: "at-resolution" as const,
        player: "opponent" as const,
        zones: ["weapon" as const],
        count: 2,
      },
      controller: "controller" as const,
    };
    const attack = hitTrainer({ slug: "fx-steal-two-weapons", power: 4, effect: stealTwoWeapons });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 4 },
      { hero: dash, weapon1: [parryBlade], weapon2: [parryBlade], deck: 4 },
      manualOpts,
    );

    expect(game.as(dash).zone("weapon1").length).toBe(1);
    expect(game.as(dash).zone("weapon2").length).toBe(1);

    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // Both stolen weapons landed in the thief's two distinct weapon seats —
    // weapon1 AND weapon2 — and the victim holds neither. Without claimed-seat
    // threading both would resolve against the pre-loop state and collide on
    // weapon1, leaving weapon2 empty.
    expect(game.as(bravo).zone("weapon1").length).toBe(1);
    expect(game.as(bravo).zone("weapon2").length).toBe(1);
    expect(game.as(dash).zone("weapon1").length).toBe(0);
    expect(game.as(dash).zone("weapon2").length).toBe(0);
  });
});
