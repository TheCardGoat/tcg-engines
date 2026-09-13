import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { hunterSKlaive } from "./hunter-s-klaive.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Hunter's Klaive (HNT009) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate costs 2 resources, opens combat with piercing 1 and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(hunterSKlaive);
    game.passBoth();

    // Combat open at reaction step — base power 1, piercing 1.
    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
    expect(game.combat()?.activeLink?.keywords).toContain("piercing");

    game.helpers.resolveRestOfCombat();
    // Go again granted — 1 AP remaining after the attack.
    expect(Arakni.actionPoints()).toBe(1);
  });

  it("happy: hit on a hero marks them", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(hunterSKlaive);
    game.helpers.resolveRestOfCombat();

    // After hit resolves, opponent should be marked.
    expectFabPlayer(game.as(dash)).toBeMarked();
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: base power is 1 with no additional modifiers", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );

    game.as(arakniMarionette).activate(hunterSKlaive);
    game.passBoth();

    // No mark on opponent, no other buffs — power stays at base 1.
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: once per turn — second activation in same turn is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Arakni = game.as(arakniMarionette);

    // First activation succeeds.
    Arakni.activate(hunterSKlaive);
    game.helpers.resolveRestOfCombat();

    // Second activation in the same turn should fail.
    Arakni.expectActivationRejected(hunterSKlaive);
  });
});
