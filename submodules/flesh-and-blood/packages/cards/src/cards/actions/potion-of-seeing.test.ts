import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { potionOfSeeingBlue } from "./potion-of-seeing.ts";

describe("Potion of Seeing (EVR184) AAA", () => {
  it("happy: Instant destroy this looks at a targeted hero's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfSeeingBlue],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(potionOfSeeingBlue);
    Dash.target(game.as(bravo));
    game.passBoth();

    expectFabCard(Dash, potionOfSeeingBlue).toBeIn("graveyard");
    expectFabCard(game.as(bravo), snatchRed).toBeIn("hand");
    expectWait(game).notToHaveDecision();
  });

  it("boundary: the Instant cannot activate from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [potionOfSeeingBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(potionOfSeeingBlue);
    expectFabCard(Dash, potionOfSeeingBlue).toBeIn("hand");
  });

  it("timing: Instant activation does not spend an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [potionOfSeeingBlue],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(potionOfSeeingBlue);
    Dash.target(game.as(bravo));
    game.passBoth();

    expectFabPlayer(Dash).toHaveAP(1);
  });
});
