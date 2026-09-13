/**
 * CRU122 Perch Grapplers — Ranger Legs d2 bladeBreak.
 * Printed: Action - {r}{r}, destroy Perch Grapplers: Until end of turn,
 * face up arrow cards played from arsenal gain go again. Go again
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { azalea, dash, deathDealer } from "../../../fixtures.ts";
import { longShotBlue } from "../../../../../../cards/src/cards/actions/long-shot.ts";
import { longShotRed } from "../../../../../../cards/src/cards/actions/long-shot.ts";
import { perchGrapplers } from "../../../../../../cards/src/cards/equipment/perch-grapplers.ts";

const LIFE = 20;

describe("perch-grapplers (CRU122)", () => {
  it("AAA: {r}{r}+destroy → face-up arrow from arsenal gets go again (AP refunded)", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [],
        legs: [perchGrapplers],
        arsenal: [
          { card: longShotBlue, state: { faceDown: false } },
          { card: longShotRed, state: { faceDown: false } },
        ],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);

    // Activate Perch Grapplers: pay 2, destroy self, itself gains go again.
    Azalea.activate(perchGrapplers);
    game.helpers.resolveUntilIdle();
    expect(Azalea.zone("legs")).not.toContain(perchGrapplers.canonicalId);
    expect(Azalea.zone("graveyard")).toContain(perchGrapplers.canonicalId);
    // Self go again refunds the activation AP (1 → 1).
    expect(Azalea.actionPoints()).toBe(1);

    // Play Long Shot (face-up arrow) from arsenal — gains go again.
    Azalea.playFromArsenal(longShotBlue, { target: game.as(dash).id });
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(LIFE - 1);
    // Arrow's go again refunds the attack AP.
    expect(Azalea.actionPoints()).toBe(1);

    // The turn-wide grant applies to every qualifying Arsenal Arrow, not only
    // the first one latched by the continuous effect.
    Azalea.playFromArsenal(longShotRed, { target: game.as(dash).id });
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(LIFE - 4);
    expect(Azalea.actionPoints()).toBe(1);
  });

  it("boundary: one resource cannot activate the two-resource ability", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [],
        legs: [perchGrapplers],
        arsenal: [longShotBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(azalea).activate(perchGrapplers)).toThrow();
    expect(game.as(azalea).zone("legs")).toContain(perchGrapplers.canonicalId);
  });
});
