import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, sigilOfSolaceRed } from "./fixtures.ts";
import { fertileGroundBlue } from "../../../cards/src/cards/instants/fertile-ground.ts";
import { ladenWithEarthRed } from "../../../cards/src/cards/actions/laden-with-earth.ts";
import { brackenRapRed } from "../../../cards/src/cards/actions/bracken-rap.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function gameFor(card: typeof ladenWithEarthRed) {
  return FabTestEngine.start(
    {
      hero: bravo,
      resourcePoints: 0,
      hand: [card, fertileGroundBlue, nimblismBlue, nimblismBlue],
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

function earthTokens(player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>) {
  return player.zone("arena").filter((id) => id === "token:embodiment-of-earth").length;
}

describe("Earth pitched-this-way status", () => {
  it("AAA resolution: an Earth pitch is carried into a non-attack action's resolution", () => {
    const game = gameFor(ladenWithEarthRed);
    const Bravo = game.as(bravo);

    Bravo.play(ladenWithEarthRed, { pitch: [fertileGroundBlue] });
    game.passBoth();

    expect(earthTokens(Bravo)).toBe(1);
  });

  it("AAA attack trigger: an Earth pitch remains attached to the declared attack", () => {
    const game = gameFor(brackenRapRed);
    const Bravo = game.as(bravo);

    Bravo.attackWith(brackenRapRed, { pitch: [fertileGroundBlue] });
    game.passBoth();

    expect(Bravo.zone("arena")).toContain("token:might");
  });
});
