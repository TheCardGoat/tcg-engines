/**
 * AAA test for effect:gain-life.
 * Representative card: Healing Balm Red (DRO025) — Generic Action.
 * Cost 0, pitch 1, defense 2.
 * Resolution: "Gain 3{h}" → effect: gain-life { amount: 3, target: controller }.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, healingBalmRed } from "../../../fixtures.ts";

describe("effect: gain-life (Healing Balm Red)", () => {
  it("AAA: playing Healing Balm at reduced life restores 3 health", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 10, hand: [healingBalmRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(healingBalmRed);

    expect(Bravo.life()).toBe(13);
    expect(Bravo.zone("graveyard")).toContain(healingBalmRed.canonicalId);
  });

  it("AAA boundary: playing Healing Balm at 20 life increases by 3 (no cap)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [healingBalmRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(healingBalmRed);

    // FaB CR: life has no maximum — gain-life simply adds.
    expect(Bravo.life()).toBe(23);
  });
});
