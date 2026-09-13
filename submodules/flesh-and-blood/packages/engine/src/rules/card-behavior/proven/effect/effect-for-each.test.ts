/**
 * AAA production behavior: effect:for-each
 * Representative leaf path: hit trainer with for-each each-hero → lose-life
 * (catalog Clear Conscience and Genis also exercise for-each; this suite owns
 * the inventory structural leaf contract).
 *
 * Arrange: 1v1 Bravos vs Dash, cost-0 hit trainer with for-each.
 * Act: attack undefended / full block; resolve combat via public moves.
 * Assert: each seat loses 1 life on hit; full block is a no-op.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, heartOfFyendal, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

const forEachEffect = {
  type: "for-each" as const,
  target: { selector: "each-hero" as const },
  effect: {
    type: "lose-life" as const,
    amount: 1,
    target: { selector: "iteration-subject" as const },
  },
};

describe("effect: for-each", () => {
  it("happy: for-each each-hero applies lose-life to both seats on hit", () => {
    const attack = hitTrainer({
      slug: "for-each-aaa",
      effect: forEachEffect,
      power: 4,
    });
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [attack], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();
    // Combat 4 to dash + 1 life each seat → bravo 19, dash 15.
    expect(game.as(bravo).life()).toBe(19);
    expect(game.as(dash).life()).toBe(15);
  });

  it("edge: full block → for-each does not fire", () => {
    const attack = hitTrainer({
      slug: "for-each-aaa-edge",
      effect: forEachEffect,
      power: 4,
    });
    const game = FabTestEngine.start(
      { hero: bravo, life: 20, hand: [attack, heartOfFyendal], deck: 4 },
      { hero: dash, life: 20, hand: [nimblismBlue, snatchRed], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.as(dash).blockWith([nimblismBlue, snatchRed]);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).life()).toBe(20);
    expect(game.as(dash).life()).toBe(20);
  });
});
