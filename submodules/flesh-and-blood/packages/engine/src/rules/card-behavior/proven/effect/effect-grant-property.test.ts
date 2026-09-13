/**
 * AAA test for effect:grant-property.
 * Representative card: Flash (ELE177) — Lightning Action, cost 0, go again.
 * Resolution effect: "The next action card you play this turn with cost 0 or
 * greater gets go again."
 * Uses grant-property with appliesTo: { next: { subtypes: ["Action"], cost: { op: "gte", value: 0 } } }
 * to create a floating keyword grant.
 *
 * Test verifies that after playing Flash, the next action card gains go again,
 * restoring the action point spent to play it.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, flash, tomeOfFyendalYellow } from "../../../fixtures.ts";

describe("effect: grant-property", () => {
  it("Arrange/Act/Assert: Flash grants go again to the next action, restoring AP", () => {
    // Arrange — Bravo has Flash (cost 0, grants go again to next action) and
    // tomeOfFyendalYellow (cost 0 Action, no go again of its own).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [flash, tomeOfFyendalYellow], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.actionPoints()).toBe(1);

    // Act 1 — Play Flash. Its own go again keeps AP at 1; the response-free
    // stack resolves under the default harness policy.
    Bravo.play(flash);
    expect(Bravo.actionPoints()).toBe(1);

    // Act 2 — Play tomeOfFyendalYellow. Flash's floating grant-property
    // gives it go again, so AP is restored after resolution.
    Bravo.play(tomeOfFyendalYellow);

    // Assert — Bravo still has 1 AP: the floating go again restored it.
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("AAA boundary: without Flash, the action card does not restore AP", () => {
    // Arrange — Bravo has only tomeOfFyendalYellow (no go again).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tomeOfFyendalYellow], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.actionPoints()).toBe(1);

    // Act — Play tomeOfFyendalYellow alone; the response-free stack resolves.
    Bravo.play(tomeOfFyendalYellow);

    // Assert — AP is 0: no floating go again to restore it.
    expect(Bravo.actionPoints()).toBe(0);
  });
});
