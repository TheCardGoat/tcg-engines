import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, pummelRed, swingBigRed } from "../../../fixtures.ts";
import { startingPoint } from "../../../../../../cards/src/cards/equipment/starting-point.ts";

describe("starting-point (ARK006)", () => {
  it("AAA: a real reaction-step Instant unlocks destroy-self and grants the attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [startingPoint],
        hand: [swingBigRed, pummelRed],
        actionPoints: 1,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, graveyard: [nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(swingBigRed, { target: Dash.id });
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Bravo);
    Bravo.play(pummelRed, { modeIndexes: [1] });
    game.helpers.passPriorityTo(Bravo);
    Bravo.activate(startingPoint);
    game.passBoth();
    if (game.getState().decision) game.answerForcedDecision();

    expect(Bravo.zone("graveyard")).toContain(startingPoint.canonicalId);
    expect(game.combat()?.activeLink?.keywords ?? []).toContain("go-again");
  });

  it("boundary: without a prior reaction-step card or ability, activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [startingPoint],
        hand: [swingBigRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(swingBigRed);
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Bravo);

    expect(() => Bravo.activate(startingPoint)).toThrow();
    expect(Bravo.zone("legs")).toContain(startingPoint.canonicalId);
  });
});
