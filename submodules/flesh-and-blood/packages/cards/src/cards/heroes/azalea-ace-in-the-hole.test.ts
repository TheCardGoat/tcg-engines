import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { searingShotRed } from "../actions/searing-shot.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { azaleaAceInTheHole } from "./azalea-ace-in-the-hole.ts";

describe("Azalea, Ace in the Hole (ARC038) AAA", () => {
  it("happy: bottoms arsenal then loads deck-top face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: azaleaAceInTheHole,
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        deckTop: [searingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azaleaAceInTheHole);
    Azalea.activate(azaleaAceInTheHole);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
  });

  it("happy: the loaded Arrow gets dominate until end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azaleaAceInTheHole,
        weapon1: [deathDealer],
        arsenal: [nimblismBlue],
        hand: [],
        actionPoints: 2,
        deckTop: [searingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azaleaAceInTheHole);
    Azalea.activate(azaleaAceInTheHole);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");

    // Attack with the loaded Arrow — the chain link must carry dominate.
    if (!Azalea.hasPriority()) game.as(dash).pass();
    Azalea.play(searingShotRed, { from: "arsenal" });
    game.passBoth();
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("core mechanic: go again refunds the action point spent to activate", () => {
    const game = FabTestEngine.start(
      {
        hero: azaleaAceInTheHole,
        arsenal: [nimblismBlue],
        hand: [],
        actionPoints: 1,
        deckTop: [searingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azaleaAceInTheHole);
    Azalea.activate(azaleaAceInTheHole);
    game.untilIdle({ entityTargets: "minimum" });

    // −1 AP to activate the Action ability, +1 from the printed Go again.
    expectFabPlayer(Azalea).toHaveAP(1);
    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
  });

  it("boundary: empty arsenal does not load the deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: azaleaAceInTheHole,
        hand: [],
        actionPoints: 1,
        deckTop: [searingShotRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azaleaAceInTheHole);
    Azalea.activate(azaleaAceInTheHole);
    game.untilIdle({ entityTargets: "minimum" });
    expect(Azalea.zone("deck")).toContain(searingShotRed.canonicalId);
  });
});
