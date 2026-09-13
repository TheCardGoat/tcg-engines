import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { searingShotRed } from "../actions/searing-shot.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { deathDealer } from "./death-dealer.ts";

describe("Death Dealer (ARC040) AAA", () => {
  it("happy: empty arsenal loads a face-up arrow from hand and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [searingShotRed],
        actionPoints: 1,
        resourcePoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(deathDealer);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
    expectFabCard(Azalea, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: occupied arsenal does not load a second arrow", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: false } }],
        hand: [searingShotRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(deathDealer);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(Azalea).toHaveHandCount(1);
    expect(Azalea.zone("arsenal")).toHaveLength(1);
  });
});
