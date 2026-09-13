import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  seedResourcePoints,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { savageSwingRed } from "../actions/savage-swing.ts";
import { alphaRampageRed } from "../actions/alpha-rampage.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snagBlue } from "../instants/snag.ts";
import { savageFeastRed } from "../actions/savage-feast.ts";
import { ladyBarthimont } from "./lady-barthimont.ts";

/**
 * Lady Barthimont (FAB045) — Brute Mentor.
 * Printed: "While Barthimont is face-down in arsenal, at the start of your
 * turn, you may turn her face-up. While Barthimont is face-up in arsenal,
 * whenever you play an attack action card, banish the top card of your deck.
 * If the banished card has 6 or more {p}, put a lesson counter on Barthimont
 * and the attack gets dominate. Then if there are 2 or more lesson counters
 * on Barthimont, banish her, search your deck for a card with
 * specialization, put it face-up into your arsenal, and shuffle."
 */
describe("Lady Barthimont (FAB045) AAA", () => {
  it("happy: two 6+{p} deck-top banishes teach Barthimont twice and the attack gets dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        arsenal: [ladyBarthimont],
        hand: [brutalAssaultBlue, savageSwingRed, snagBlue, nimblismBlue],
        deck: [savageFeastRed, savageSwingRed, alphaRampageRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "accept" });
    seedResourcePoints(game, 3, Rhinar);

    // First attack: the deck top (Alpha Rampage, 9{p}) is banished, the
    // attack gets dominate, and Barthimont takes a lesson counter.
    Rhinar.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveKeyword("dominate");
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Rhinar, ladyBarthimont).toHaveCounters(1, "lesson");

    // Second attack on the next turn: the next 6+{p} deck top teaches
    // again — counter 2 banishes her.
    Rhinar.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    seedResourcePoints(game, 1, Rhinar);
    Rhinar.playAttack(savageSwingRed);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Rhinar.cardsIn("banished", ladyBarthimont)).toHaveLength(1);
  });

  it("boundary: a low-{p} deck top neither dominates the attack nor teaches", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        arsenal: [ladyBarthimont],
        hand: [brutalAssaultBlue, snagBlue, nimblismBlue],
        deck: [nimblismBlue],
        deckTop: [snagBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    game.as(dash).endTurn();
    game.helpers.untilIdle({ optionals: "accept" });
    seedResourcePoints(game, 2, Rhinar);

    Rhinar.playAttack(brutalAssaultBlue);
    expectCombat(game).notToHaveKeyword("dominate");
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Rhinar, ladyBarthimont).toBeIn("arsenal");
    expectFabCard(Rhinar, ladyBarthimont).toHaveCounters(0, "lesson");
  });
});
