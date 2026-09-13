import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, sigilOfSolaceRed } from "./fixtures.ts";
import { tomeOfDivinityYellow } from "../../../cards/src/cards/instants/tome-of-divinity.ts";
import { invigoratingLightRed } from "../../../cards/src/cards/actions/invigorating-light.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function opposingSetup() {
  return {
    hero: dash,
    hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
    arsenal: [sigilOfSolaceRed],
    deck: 4,
  };
}

describe("Tome of Divinity alternative draw", () => {
  it("AAA false branch: without a same-turn soul entry, draw exactly two", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        resourcePoints: 4,
        hand: [tomeOfDivinityYellow, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      opposingSetup(),
      manual,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tomeOfDivinityYellow);
    game.passBoth();

    expect(Bravo.zone("deck")).toHaveLength(2);
  });

  it("AAA true branch: a real combat-chain-close soul entry replaces the draw-two result with draw-three", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        resourcePoints: 7,
        hand: [invigoratingLightRed, tomeOfDivinityYellow, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      opposingSetup(),
      manual,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(invigoratingLightRed);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.zone("soul")).toContain(invigoratingLightRed.canonicalId);

    Bravo.play(tomeOfDivinityYellow);
    game.passBoth();

    expect(Bravo.zone("deck")).toHaveLength(1);
  });
});
