/**
 * CR 8.5.33 Ignore — a replacement modification under which the matched event
 * is considered to never have happened. This test installs an ignore
 * replacement (mirroring the `replacement` leaf contract) and asserts it is
 * registered with modification.type "ignore". Whole-event suppression shares
 * the replacement-engine branch with cancel-event (8.5.33a); part-of-event
 * ignore (8.5.33b) is deferred.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, heartOfFyendal } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

describe("effect: ignore — CR 8.5.33 replacement modification", () => {
  it("registers an ignore replacement over gain-assets", () => {
    const attack = hitTrainer({
      slug: "fx-ignore-replacement",
      power: 4,
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: { name: "gain" },
        modification: { type: "ignore" },
        duration: "this-turn",
      },
    });

    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    const registered = game
      .getState()
      .replacementEffects.some(
        (replacement) =>
          replacement.effect.type === "replacement" &&
          replacement.effect.modification.type === "ignore" &&
          replacement.effect.replaces.name === "gain",
      );
    expect(registered).toBe(true);
  });
});
