/** EVO000 Master Cog Yellow — pitch trigger: optional steam counter on crank item. */
import { describe, expect, it } from "vitest";
import { masterCogYellow } from "../../../../cards/src/cards/resources/master-cog.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimbleStrikeRed } from "../../rules/fixtures.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

describe("Master Cog resource (EVO000)", () => {
  it("AAA: pitches to pay for Nimble Strike (cost 1)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, masterCogYellow], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(nimbleStrikeRed, { pitch: [masterCogYellow] });
    const stackDrainGuard = createFabLoopGuard({ label: "master-cog: drain rules stack" });
    while (game.getState().rulesStack.length > 0) {
      stackDrainGuard.tick();
      game.passBoth();
    }
    expect(Bravo.zone("pitch")).toContain(masterCogYellow.canonicalId);
  });
});
