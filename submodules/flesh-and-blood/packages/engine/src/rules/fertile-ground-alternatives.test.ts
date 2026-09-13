import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dash, nimblismBlue, sigilOfSolaceRed } from "./fixtures.ts";
import { fertileGroundRed } from "../../../cards/src/cards/instants/fertile-ground.ts";
import { fertileGroundYellow } from "../../../cards/src/cards/instants/fertile-ground.ts";
import { fertileGroundBlue } from "../../../cards/src/cards/instants/fertile-ground.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function startFertileGroundGame(banishedEarth: number) {
  return FabTestEngine.start(
    {
      hero: dash,
      life: 10,
      resourcePoints: 2,
      hand: [fertileGroundRed, nimblismBlue, nimblismBlue, nimblismBlue],
      arsenal: [sigilOfSolaceRed],
      banished: Array.from({ length: banishedEarth }, () => fertileGroundBlue),
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

describe("Fertile Ground alternative life gain", () => {
  it("AAA false branch: fewer than four Earth cards gives only the base 2 life", () => {
    const game = startFertileGroundGame(3);
    const Dash = game.as(dash, 1);

    Dash.play(fertileGroundRed);
    game.passBoth();

    expect(Dash.life()).toBe(12);
  });

  it("AAA true branch: four Earth cards replaces—not adds to—the red base result", () => {
    const game = startFertileGroundGame(4);
    const Dash = game.as(dash, 1);

    Dash.play(fertileGroundRed);
    game.passBoth();

    expect(Dash.life()).toBe(15);
  });

  it("AAA pitch variants: yellow and blue retain their own alternative amounts", () => {
    const yellow = FabTestEngine.start(
      {
        hero: dash,
        life: 10,
        resourcePoints: 2,
        hand: [fertileGroundYellow, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        banished: [fertileGroundBlue, fertileGroundBlue, fertileGroundBlue, fertileGroundBlue],
        deck: 4,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue], deck: 4 },
      manual,
    );
    const YellowDash = yellow.as(dash, 1);
    YellowDash.play(fertileGroundYellow);
    yellow.passBoth();

    const blue = FabTestEngine.start(
      {
        hero: dash,
        life: 10,
        resourcePoints: 2,
        hand: [fertileGroundBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        banished: [
          fertileGroundYellow,
          fertileGroundYellow,
          fertileGroundYellow,
          fertileGroundYellow,
        ],
        deck: 4,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue], deck: 4 },
      manual,
    );
    const BlueDash = blue.as(dash, 1);
    BlueDash.play(fertileGroundBlue);
    blue.passBoth();

    expect(YellowDash.life()).toBe(14);
    expect(BlueDash.life()).toBe(13);
  });
});
