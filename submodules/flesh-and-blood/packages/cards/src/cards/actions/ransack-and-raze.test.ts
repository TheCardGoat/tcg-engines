import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { greatLibraryOfSolana } from "./great-library-of-solana.ts";
import { deathmatchArena } from "./deathmatch-arena.ts";
import { ransackAndRazeBlue } from "./ransack-and-raze.ts";

describe("Ransack and Raze (PEN327) AAA", () => {
  it("happy: destroying a cost-2 landmark creates 2 Gold tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ransackAndRazeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [greatLibraryOfSolana], hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(ransackAndRazeBlue, {
      targetInstanceId: Dash.findCardInZone("arena", greatLibraryOfSolana),
    });

    expectFabCard(Dash, greatLibraryOfSolana).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 2);
  });

  it("boundary: destroying a cost-0 landmark creates no Gold tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ransackAndRazeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [deathmatchArena], hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(ransackAndRazeBlue, {
      targetInstanceId: Dash.findCardInZone("arena", deathmatchArena),
    });

    expectFabCard(Dash, deathmatchArena).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
  });

  it("timing: this has go again after the destroy resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [ransackAndRazeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [greatLibraryOfSolana], hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(ransackAndRazeBlue, {
      targetInstanceId: game.as(dash).findCardInZone("arena", greatLibraryOfSolana),
    });

    expectFabCard(Bravo, ransackAndRazeBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
