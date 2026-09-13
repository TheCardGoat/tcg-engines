import { timekeeperSWhimBlue } from "./timekeeper-s-whim.ts";
import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { timekeeperSWhimRed } from "./timekeeper-s-whim.ts";

/**
 * Timekeeper's Whim (EVR134) — Wizard Action, cost 3, 5 arcane.
 * Printed: Deal 5 arcane. If played during an opponent's turn, put it on
 * the bottom of its owner's deck.
 */

describe("Timekeeper's Whim (EVR134) AAA", () => {
  it("happy: on your turn this deals 5 arcane and goes to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [timekeeperSWhimRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(timekeeperSWhimRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Blaze, timekeeperSWhimRed).toBeIn("graveyard");
  });

  it("boundary: unpayable cost keeps the card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [timekeeperSWhimRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    expectFabUnplayable(() => Blaze.play(timekeeperSWhimRed, { target: game.as(dash).id }));
    expectFabCard(Blaze, timekeeperSWhimRed).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: the Action is not playable while the opponent holds priority", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [timekeeperSWhimRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    expectFabUnplayable(
      () => Blaze.play(timekeeperSWhimRed, { target: game.as(dash).id }),
      /priority|couldn't be played|unpayable/i,
    );
    expectFabCard(Blaze, timekeeperSWhimRed).toBeIn("hand");
  });

  it("happy: on your turn this deals 3 arcane and goes to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [timekeeperSWhimBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(timekeeperSWhimBlue, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Blaze, timekeeperSWhimBlue).toBeIn("graveyard");
  });
});
