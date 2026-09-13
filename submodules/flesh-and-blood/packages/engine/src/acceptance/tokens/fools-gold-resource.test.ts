/** SEA215 Fool's Gold Yellow — pitch-to-discard trigger creates Gold token. */
import { describe, expect, it } from "vitest";
import { foolSGoldYellow } from "../../../../cards/src/cards/resources/fool-s-gold.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimbleStrikeRed } from "../../rules/fixtures.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

describe("Fool's Gold resource (SEA215)", () => {
  it("AAA: pitches to pay for Nimble Strike (cost 1)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, foolSGoldYellow], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(nimbleStrikeRed, { pitch: [foolSGoldYellow] });
    const stackDrainGuard = createFabLoopGuard({ label: "fools-gold: drain rules stack" });
    while (game.getState().rulesStack.length > 0) {
      stackDrainGuard.tick();
      game.passBoth();
    }
    expect(Bravo.zone("pitch")).toContain(foolSGoldYellow.canonicalId);
  });
});
