import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { evergreenRed } from "./evergreen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brackenRapRed } from "./bracken-rap.ts";
import { brackenRapYellow } from "./bracken-rap.ts";

/**
 * Bracken Rap (TER008) — When this attacks, if an Earth card was pitched to play this, create a Might token.
 */

describe("Bracken Rap (TER008) AAA", () => {
  it("happy: pitching an Earth card creates a Might token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brackenRapRed, evergreenRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(evergreenRed, nimblismBlue, nimblismBlue).playAttack(brackenRapRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });

  it("boundary: pitching only Generic cards creates no Might", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brackenRapRed, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(nimblismBlue, nimblismBlue, nimblismBlue).playAttack(brackenRapRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });

  it("timing: Might exists at on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brackenRapRed, evergreenRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(evergreenRed, nimblismBlue, nimblismBlue).playAttack(brackenRapRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });
});

/**
 * Bracken Rap (TER014) — When this attacks, if an Earth card was pitched to play this, create a Might token.
 */

describe("Bracken Rap (TER014) AAA", () => {
  it("happy: pitching an Earth card creates a Might token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brackenRapYellow, evergreenRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(evergreenRed, nimblismBlue, nimblismBlue).playAttack(brackenRapYellow);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });

  it("boundary: pitching only Generic cards creates no Might", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brackenRapYellow, nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(nimblismBlue, nimblismBlue, nimblismBlue).playAttack(brackenRapYellow);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });

  it("timing: Might exists at on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brackenRapYellow, evergreenRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(evergreenRed, nimblismBlue, nimblismBlue).playAttack(brackenRapYellow);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });
});
