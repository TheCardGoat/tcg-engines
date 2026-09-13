import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { emperorDracaiOfAesir } from "../heroes/emperor-dracai-of-aesir.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { tomeOfImperialFlameRed } from "./tome-of-imperial-flame.ts";

/**
 * Tome of Imperial Flame (EVO245) — Draconic Action, cost 0, go again.
 *
 * Printed: "Draw a card. If you are Royal, instead draw 2 cards.
 * You may pitch 2 red cards. If you don't, banish your hand.
 * Go again"
 *
 * The unless-escape is itself an optional pitch: after the unless boolean,
 * a second boolean arms the pitch-card target.
 */

describe("Tome of Imperial Flame (EVO245) AAA", () => {
  it("happy: a Royal hero instead draws 2 and may pitch 2 red cards to keep the rest of hand", () => {
    const game = FabTestEngine.start(
      {
        hero: emperorDracaiOfAesir,
        hand: [tomeOfImperialFlameRed, snatchRed, snatchRed, nimblismBlue],
        actionPoints: 1,
        deckTop: [snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Emperor = game.as(emperorDracaiOfAesir);

    Emperor.play(tomeOfImperialFlameRed);
    game.passBoth();
    Emperor.accept();
    Emperor.accept();
    Emperor.target(...Emperor.cardsIn("hand", snatchRed).slice(0, 2));
    game.helpers.resolveUntilIdle();

    expectFabCard(Emperor, tomeOfImperialFlameRed).toBeIn("graveyard");
    expect(Emperor.cardsIn("hand", nimblismBlue)).toHaveLength(2);
    expect(Emperor.cardsIn("pitch", snatchRed)).toHaveLength(2);
    // Printed "instead draw 2 cards": the Royal draw-2 replaces the base
    // draw-1 (CR 6.4.7), so after pitching 2 reds the hand holds 3.
    expectFabPlayer(Emperor).toHaveHandCount(3);
  });

  it("boundary: a non-Royal hero draws 1 and, without 2 red cards, banishes that card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tomeOfImperialFlameRed],
        actionPoints: 1,
        deckTop: [snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tomeOfImperialFlameRed);
    game.helpers.resolveUntilIdle();

    expect(Bravo.cardsIn("banished", nimblismBlue)).toHaveLength(1);
    expect(Bravo.cardsIn("deck", snatchRed)).toHaveLength(1);
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("timing: go again refunds the action point; declining the escape banishes the hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tomeOfImperialFlameRed, snatchRed, snatchRed],
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabPlayer(Bravo).toHaveAP(1);
    Bravo.play(tomeOfImperialFlameRed);
    game.passBoth();
    Bravo.decline();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveAP(1);
    expect(Bravo.cardsIn("banished", snatchRed)).toHaveLength(2);
    expect(Bravo.cardsIn("banished", nimblismBlue)).toHaveLength(1);
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });
});
