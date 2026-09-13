import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { quickdodgeFlexors } from "../../../../../../cards/src/cards/equipment/quickdodge-flexors.ts";

describe("quickdodge-flexors (HNT215)", () => {
  it("AAA: pays {r}, adds itself at 2 defense, then destroys at the controller's end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], legs: [quickdodgeFlexors], resourcePoints: 1, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    Attacker.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Defender);
    Defender.activate(quickdodgeFlexors);
    game.helpers.resolveRestOfCombat();

    expect(Defender.resourcePoints()).toBe(0);
    expect(Defender.life()).toBe(18);
    expect(Defender.zone("legs")).toContain(quickdodgeFlexors.canonicalId);

    Attacker.endTurn();
    game.passBoth();
    Defender.endTurn();
    expect(Defender.zone("legs")).not.toContain(quickdodgeFlexors.canonicalId);
    expect(Defender.zone("graveyard")).toContain(quickdodgeFlexors.canonicalId);
  });

  it("boundary: zero resources cannot activate the Defense Reaction", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 4 },
      { hero: dash, hand: [], legs: [quickdodgeFlexors], resourcePoints: 0, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    Attacker.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Defender);
    expect(() => Defender.activate(quickdodgeFlexors)).toThrow();
    expect(Defender.zone("legs")).toContain(quickdodgeFlexors.canonicalId);
  });
});
