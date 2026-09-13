import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { sigilOfSolaceRed } from "../../../../../../cards/src/cards/instants/sigil-of-solace.ts";
import { lightningGreaves } from "../../../../../../cards/src/cards/equipment/lightning-greaves.ts";

describe("lightning-greaves (ROS071)", () => {
  it("AAA: Instant activation grants a later Sigil of Solace go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [lightningGreaves],
        hand: [sigilOfSolaceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(lightningGreaves);
    game.passBoth();

    expect(Bravo.zone("graveyard")).toContain(lightningGreaves.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    const grant = game
      .getState()
      .continuousEffectInstances.find((instance) =>
        instance.atoms.some(
          (atom) =>
            atom.kind === "ability" &&
            atom.property.kind === "keyword" &&
            atom.property.keyword.name === "go-again",
        ),
      );
    expect(grant?.futureApplicability?.remaining).toBeGreaterThan(1);
    Bravo.play(sigilOfSolaceRed);
    expect(game.getState().rulesStack.at(-1)?.keywords).toContain("go-again");
    game.passBoth();
    game.passBoth();

    expect(Bravo.life()).toBe(23);
    expect(Bravo.actionPoints()).toBe(2);
  });

  it("boundary: no resource cannot activate the Greaves", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [lightningGreaves],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(bravo).activate(lightningGreaves)).toThrow();
    expect(game.as(bravo).zone("legs")).toContain(lightningGreaves.canonicalId);
  });
});
