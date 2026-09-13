import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { countYourBlessingsRed, countYourBlessingsYellow } from "./count-your-blessings.ts";

describe("Count Your Blessings family AAA", () => {
  it("happy: the red printing gains its base amount and moves to the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [countYourBlessingsRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(countYourBlessingsRed);

    expectFabPlayer(Bravo).toHaveLife(23);
    expectFabCard(Bravo, countYourBlessingsRed).toBeIn("graveyard");
  });

  it("boundary: each matching family card in the graveyard increases X", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [countYourBlessingsRed],
        graveyard: [countYourBlessingsYellow],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(countYourBlessingsRed);

    expectFabPlayer(Bravo).toHaveLife(24);
  });

  it("timing: a non-matching graveyard card does not increase X", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [countYourBlessingsRed],
        graveyard: [snatchRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(countYourBlessingsRed);

    expectFabPlayer(Bravo).toHaveLife(23);
  });
});
