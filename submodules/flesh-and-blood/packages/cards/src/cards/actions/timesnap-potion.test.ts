import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { timesnapPotionBlue } from "./timesnap-potion.ts";

describe("Timesnap Potion (RNR029) AAA", () => {
  it("happy: destroy this to gain 2 action points (net +1)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [timesnapPotionBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(timesnapPotionBlue);
    game.passBoth();

    expectFabCard(Bravo, timesnapPotionBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(2);
  });

  it("boundary: without activation the item stays in the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [timesnapPotionBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, timesnapPotionBlue).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("timing: playing the item is not combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [timesnapPotionBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(timesnapPotionBlue);
    game.passBoth();

    expectFabCard(Bravo, timesnapPotionBlue).toBeIn("arena");
    expect(game.combat()).toBeNull();
  });
});
