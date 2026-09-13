import { pryBlue } from "./pry.ts";

import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { biteBlue } from "./bite.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pryRed } from "./pry.ts";

/**
 * Pry, Red (EVR128) — Wizard Action, cost 0, 3{d}.
 *
 * Printed: Target hero reveals 3 cards from their hand. If Pry is played
 * during an opponents turn, instead they reveal all cards in their hand.
 * You may choose a card revealed this way. If you do, that hero puts it on
 * the bottom of their deck then draws a card.
 */

describe("Pry (EVR128) AAA", () => {
  it("happy: choose a revealed card, they put it on the bottom and draw", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [pryRed, snatchRed, nimblismBlue, commandAndConquerRed, biteBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [woundingBlowBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(pryRed, { target: Blaze.id });
    game.passBoth();
    Blaze.target(snatchRed, nimblismBlue, commandAndConquerRed);
    Blaze.chooseBoolean(true);
    Blaze.targetRequired(snatchRed);
    game.untilIdle();

    expect(Blaze.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Blaze, nimblismBlue).toBeIn("hand");
    expectFabCard(Blaze, commandAndConquerRed).toBeIn("hand");
    expectFabCard(Blaze, biteBlue).toBeIn("hand");
    expectFabCard(Blaze, pryRed).toBeIn("graveyard");
  });

  it("boundary: an empty hand reveals nothing, so they do not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [pryRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        deck: 6,
        deckTop: [woundingBlowBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(pryRed, { target: Dash.id });
    game.untilIdle({ optionals: "decline" });

    expect(Dash.zone("deck")).toContain(woundingBlowBlue.canonicalId);
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("timing: the targeted opponent reveals and replaces a card from their own hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [pryRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue, commandAndConquerRed, biteBlue],
        deck: 6,
        deckTop: [woundingBlowBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(pryRed, { target: Dash.id });
    game.passBoth();
    Dash.target(snatchRed, nimblismBlue, commandAndConquerRed);
    Blaze.chooseBoolean(true);
    Blaze.targetRequired(snatchRed);
    game.untilIdle();

    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, commandAndConquerRed).toBeIn("hand");
    expectFabCard(Dash, biteBlue).toBeIn("hand");
    expectFabCard(Blaze, pryRed).toBeIn("graveyard");
  });

  it("happy: on your turn they reveal 1, you choose it, they put it on the bottom and draw", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [pryBlue, snatchRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [woundingBlowBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(pryBlue, { target: Blaze.id });
    game.passBoth();
    Blaze.targetRequired(snatchRed);
    Blaze.chooseBoolean(true);
    game.untilIdle();

    expect(Blaze.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Blaze, nimblismBlue).toBeIn("hand");
    expectFabCard(Blaze, pryBlue).toBeIn("graveyard");
  });
});
