import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { layDownTheChallengeYellow } from "./lay-down-the-challenge.ts";

/**
 * Lay Down the Challenge (PEN007) — Brute Action, cost 0, go again.
 *
 * Printed: Intimidate target hero, then if they have more cards in hand than
 * you, draw a card.
 */

describe("Lay Down the Challenge (PEN007) AAA", () => {
  it("happy: intimidate, then draw if they still have more cards in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [layDownTheChallengeYellow],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.play(layDownTheChallengeYellow);
    game.untilIdle();

    expect(Dash.zone("banished")).toHaveLength(1);
    expectFabPlayer(Rhinar).toHaveHandCount(1);
    expectFabCard(Rhinar, nimblismBlue).toBeIn("hand");
    expectFabCard(Rhinar, layDownTheChallengeYellow).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveAP(1);
  });

  it("boundary: intimidate an empty hand, do not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [layDownTheChallengeYellow],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(layDownTheChallengeYellow);
    game.untilIdle();

    expect(game.as(dash).zone("banished")).toHaveLength(0);
    expectFabPlayer(Rhinar).toHaveHandCount(0);
    expectFabCard(Rhinar, layDownTheChallengeYellow).toBeIn("graveyard");
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, hand: [layDownTheChallengeYellow], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    game.toReaction();
    expect(() => Rhinar.play(layDownTheChallengeYellow)).toThrow();
    expectFabCard(Rhinar, layDownTheChallengeYellow).toBeIn("hand");
    expectFabPlayer(Rhinar).toHaveHandCount(1);
  });
});
