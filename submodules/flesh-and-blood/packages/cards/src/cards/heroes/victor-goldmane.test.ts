import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { bravo } from "./bravo.ts";
import { visitGoldmaneEstateBlue } from "../actions/visit-goldmane-estate.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { ragingOnslaughtRed } from "../actions/raging-onslaught.ts";
import { testOfMightRed } from "../blocks/test-of-might.ts";
import { victorGoldmaneHighAndMighty } from "./victor-goldmane-high-and-mighty.ts";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { trounceRed } from "../blocks/trounce.ts";
import { victorGoldmane } from "./victor-goldmane.ts";

/**
 * Victor Goldmane (HVY048) — Guardian Hero - Young, Clash.
 *
 * Printed:
 *   The first time each turn you create a Gold token from an effect you
 *   control, draw a card.
 *   The first time each turn you would fail to win a clash, instead you may
 *   destroy a Gold you control. If you do, put 1 of the revealed cards on the
 *   bottom of its owner's deck, then clash again.
 */

describe("Victor Goldmane (HVY048) AAA", () => {
  it("happy: the first Gold created from an effect you control draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        hand: [visitGoldmaneEstateBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);

    Victor.play(visitGoldmaneEstateBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Victor).toHaveTokenCount("gold", 1).toHaveHandCount(1);
  });

  it("boundary: a second Gold creation the same turn does not draw again", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        hand: [visitGoldmaneEstateBlue, visitGoldmaneEstateBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);

    Victor.play(visitGoldmaneEstateBlue);
    game.helpers.resolveUntilIdle();
    Victor.play(visitGoldmaneEstateBlue);
    game.helpers.resolveUntilIdle();

    // Two Golds, one draw: played 2, drew 1.
    expectFabPlayer(Victor).toHaveTokenCount("gold", 2).toHaveHandCount(1);
  });

  it("happy: destroying Gold to clash again awards the fresh clash's prize to its winner", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        hand: [snatchRed],
        arena: [fabToken("gold")],
        resourcePoints: 0,
        actionPoints: 1,
        // Bottom-first: last is the clash reveal. Snatch red is 4{p}.
        deck: [nimblismBlue, snatchRed],
      },
      {
        hero: bravo,
        hand: [testOfMightRed],
        // Raging Onslaught red is 7{p}; Nimblism is 0{p} under it.
        deck: [nimblismBlue, ragingOnslaughtRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);
    const bravoReveal = Bravo.cardIn("deck", ragingOnslaughtRed);

    Victor.playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "accept", entityTargets: "pause" });
    Victor.target(bravoReveal);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Victor);
    expectFabPlayer(Victor).toHaveTokenCount("gold", 0).toHaveTokenCount("might", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });

  it("boundary: declining the Gold destroy leaves the lost clash's prize with the winner", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        hand: [snatchRed],
        arena: [fabToken("gold")],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [testOfMightRed],
        deck: [snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);

    Victor.playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Bravo);
    expectFabPlayer(Victor).toHaveTokenCount("gold", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });

  it("timing: the fresh clash's winner still receives the prize after a reclash loss", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        hand: [snatchRed],
        arena: [fabToken("gold")],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      {
        hero: bravo,
        hand: [testOfMightRed],
        deck: [nimblismBlue, ragingOnslaughtRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);
    const Bravo = game.as(bravo);
    const victorReveal = Victor.cardIn("deck", snatchRed);

    Victor.playAttack(snatchRed);
    Bravo.defendWith(testOfMightRed);
    game.untilIdle({ optionals: "accept", entityTargets: "pause" });
    Victor.target(victorReveal);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Bravo);
    expectFabPlayer(Victor).toHaveTokenCount("gold", 0).toHaveTokenCount("might", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
  });
});

// Both canonical hero versions must distinguish creator from effect controller.
describe("Victor Goldmane creation effect controller", () => {
  it.each([
    { label: "Victor Goldmane", hero: victorGoldmane },
    { label: "Victor Goldmane, High and Mighty", hero: victorGoldmaneHighAndMighty },
  ])("$label does not draw from opponent-controlled Trounce", ({ hero }) => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [ragingOnslaughtRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue, ragingOnslaughtRed, commandAndConquerRed],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(hero);
    const Bravo = game.as(bravo);
    Victor.playAttack(ragingOnslaughtRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle();
    expectFabPlayer(Victor)
      .toHaveTokenCount("gold", 1)
      .toHaveTokenCount("might", 1)
      .toHaveTokenCount("vigor", 1)
      .toHaveHandCount(0);
    expectFabPlayer(Bravo).toHaveLife(16).toHaveTokenCount("gold", 0);
    expectCombat(game).toBeClosed();
  });
  it.each([
    { label: "Victor Goldmane", hero: victorGoldmane },
    { label: "Victor Goldmane, High and Mighty", hero: victorGoldmaneHighAndMighty },
  ])("$label still draws on the first own effect after opposing creation", ({ hero }) => {
    const game = FabTestEngine.start(
      // Extra AP is arranged as a mid-turn resource; no creation history is seeded.
      {
        hero,
        hand: [ragingOnslaughtRed, visitGoldmaneEstateBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: [nimblismBlue, ragingOnslaughtRed, commandAndConquerRed],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(hero);
    const Bravo = game.as(bravo);
    const secondReveal = Victor.cardIn("deck", ragingOnslaughtRed);
    Victor.playAttack(ragingOnslaughtRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle();
    expectFabPlayer(Victor).toHaveTokenCount("gold", 1).toHaveHandCount(1).toHaveAP(1);
    expectFabCard(Victor, visitGoldmaneEstateBlue).toBeIn("hand");
    Victor.play(visitGoldmaneEstateBlue);
    game.untilIdle();
    expectFabPlayer(Victor)
      .toHaveTokenCount("gold", 2)
      .toHaveTokenCount("might", 1)
      .toHaveTokenCount("vigor", 1)
      .toHaveHandCount(1);
    expectFabCard(Victor, secondReveal).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveLife(16);
    expectCombat(game).toBeClosed();
  });
});
