import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { forgedForWarYellow } from "./forged-for-war.ts";
import { greatLibraryOfSolana } from "./great-library-of-solana.ts";

describe("Great Library of Solana (MON000) AAA", () => {
  it("happy: plays as a landmark", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [greatLibraryOfSolana],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(greatLibraryOfSolana);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Boltyn, greatLibraryOfSolana).toBeIn("arena");
  });

  it("happy: 2 yellow in pitch at end phase draws to 5{i}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        arena: [greatLibraryOfSolana],
        pitch: [forgedForWarYellow, forgedForWarYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Boltyn).toHaveHandCount(5);
  });

  it("boundary: 1 yellow card in pitch does not grant +1{i}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        arena: [greatLibraryOfSolana],
        pitch: [forgedForWarYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Boltyn).toHaveHandCount(4);
  });

  it("happy: discarding 2 yellow destroys this and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        arena: [greatLibraryOfSolana],
        hand: [forgedForWarYellow, forgedForWarYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activate(greatLibraryOfSolana);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Boltyn, greatLibraryOfSolana).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveHandCount(0);
    expectFabPlayer(Boltyn).toHaveAP(1);
  });

  it("boundary: 1 yellow card cannot pay the discard cost", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        arena: [greatLibraryOfSolana],
        hand: [forgedForWarYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    expectFabUnplayable(
      () => Boltyn.activate(greatLibraryOfSolana),
      /discard is unavailable|unpayable|cannot be paid/i,
    );
    expectFabCard(Boltyn, greatLibraryOfSolana).toBeIn("arena");
  });

  it("timing: the opponent may activate this on their turn", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        arena: [greatLibraryOfSolana],
        hand: [],
        deck: 6,
      },
      {
        hero: dash,
        hand: [forgedForWarYellow, forgedForWarYellow],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    Dash.activate(greatLibraryOfSolana);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Boltyn, greatLibraryOfSolana).toBeIn("graveyard");
    expect(Dash.zone("graveyard")).toHaveLength(2);
  });
});
