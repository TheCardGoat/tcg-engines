/** HNT000 Schism of Chaos Blue — pitch trigger: each hero shuffles, top→arsenal facedown. */
import { describe, expect, it } from "vitest";
import { schismOfChaosBlue } from "../../../../cards/src/cards/resources/schism-of-chaos.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimbleStrikeRed } from "../../rules/fixtures.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

describe("Schism of Chaos resource (HNT000)", () => {
  it("AAA: pitches to pay for Nimble Strike (cost 1)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, schismOfChaosBlue], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(nimbleStrikeRed, { pitch: [schismOfChaosBlue] });
    const stackDrainGuard = createFabLoopGuard({ label: "schism-of-chaos: drain rules stack" });
    while (game.getState().rulesStack.length > 0) {
      stackDrainGuard.tick();
      game.passBoth();
    }
    expect(Bravo.zone("pitch")).toContain(schismOfChaosBlue.canonicalId);
  });
});
