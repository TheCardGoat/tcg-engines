import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, sigilOfSolaceRed } from "./fixtures.ts";
import { fertileGroundBlue } from "../../../cards/src/cards/instants/fertile-ground.ts";
import { seedsOfStrengthRed } from "../../../cards/src/cards/actions/seeds-of-strength.ts";
import { seedsOfStrengthYellow } from "../../../cards/src/cards/actions/seeds-of-strength.ts";
import { seedsOfStrengthBlue } from "../../../cards/src/cards/actions/seeds-of-strength.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;
type SeedsOfStrength = typeof seedsOfStrengthRed;

function startSeedsGame(card: SeedsOfStrength, pitch: typeof nimblismBlue) {
  return FabTestEngine.start(
    {
      hero: bravo,
      resourcePoints: 0,
      hand: [card, pitch, nimblismBlue, nimblismBlue],
      arsenal: [sigilOfSolaceRed],
      deck: 4,
    },
    {
      hero: dash,
      hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      arsenal: [sigilOfSolaceRed],
      deck: 4,
    },
    manual,
  );
}

function mights(player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>): number {
  return player.zone("arena").filter((canonicalId) => canonicalId === "token:might").length;
}

describe("Seeds of Strength alternative token creation", () => {
  it("AAA false branch: a non-Earth pitch creates only the red base three Might tokens", () => {
    const game = startSeedsGame(seedsOfStrengthRed, nimblismBlue);
    const Bravo = game.as(bravo);

    Bravo.play(seedsOfStrengthRed, { pitch: [nimblismBlue] });
    game.passBoth();

    expect(mights(Bravo)).toBe(3);
  });

  it("AAA true branch: an Earth pitch replaces—not adds to—the red base result", () => {
    const game = startSeedsGame(seedsOfStrengthRed, fertileGroundBlue);
    const Bravo = game.as(bravo);

    Bravo.play(seedsOfStrengthRed, { pitch: [fertileGroundBlue] });
    game.passBoth();

    expect(mights(Bravo)).toBe(4);
  });

  it("AAA pitch variants: yellow and blue retain their own Earth-pitch alternatives", () => {
    const yellow = startSeedsGame(seedsOfStrengthYellow, fertileGroundBlue);
    const YellowBravo = yellow.as(bravo);
    YellowBravo.play(seedsOfStrengthYellow, { pitch: [fertileGroundBlue] });
    yellow.passBoth();

    const blue = startSeedsGame(seedsOfStrengthBlue, fertileGroundBlue);
    const BlueBravo = blue.as(bravo);
    BlueBravo.play(seedsOfStrengthBlue, { pitch: [fertileGroundBlue] });
    blue.passBoth();

    expect(mights(YellowBravo)).toBe(3);
    expect(mights(BlueBravo)).toBe(2);
  });
});
