import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { scoutingShotRed } from "./scouting-shot.ts";

describe("Scouting Shot (SEA109) AAA", () => {
  it("happy: loading this face-up into arsenal may look at the top card of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deckTop: [scoutingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Azalea, scoutingShotRed).toBeIn("arsenal");
    expectWait(game).toBeIdle();
  });

  it("boundary: declining the look still leaves this in arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deckTop: [scoutingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(azalea);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Azalea, scoutingShotRed).toBeIn("arsenal");
    expectWait(game).toBeIdle();
  });

  it("timing: an already-arsenal copy does not reopen a look", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [{ card: scoutingShotRed, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(azalea), scoutingShotRed).toBeIn("arsenal");
    expectWait(game).toBeIdle();
  });
});
