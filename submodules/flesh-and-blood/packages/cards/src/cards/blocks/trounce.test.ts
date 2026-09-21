import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { victorGoldmane } from "../heroes/victor-goldmane.ts";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { ragingOnslaughtRed } from "../actions/raging-onslaught.ts";
import { gold } from "../tokens/gold.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { trounceRed } from "./trounce.ts";

/**
 * Trounce (HVY061) — Guardian Block.
 * Printed: When this defends, clash with the attacking hero. Put the revealed
 * cards on the bottom of their owner's deck, then clash again. If a hero wins
 * both clashes, they create a Gold, Might, and Vigor token.
 */

describe("Trounce (HVY061) AAA", () => {
  it.each([true, false])(
    "interaction: Victor accepts failed-clash replacement = %s",
    (acceptReplacement) => {
      const game = FabTestEngine.start(
        { hero: dash, hand: [snatchRed], deck: [nimblismBlue, snatchRed] },
        {
          hero: victorGoldmane,
          hand: [trounceRed],
          arena: [gold],
          deck: [ragingOnslaughtRed, commandAndConquerRed, nimblismBlue],
        },
        { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
      );
      const Dash = game.as(dash);
      const Victor = game.as(victorGoldmane);
      const firstVictorReveal = Victor.cardIn("deck", nimblismBlue);

      Dash.playAttack(snatchRed);
      Victor.defendWith(trounceRed);
      Dash.pass();
      Victor.pass();
      if (acceptReplacement) {
        Victor.choose(
          "firstTimeTurnFailWinClashInsteadDestroyGoldPut1RevealedBottomOwnersDeckThenClashAgain",
        );
        Victor.target(gold);
        Victor.target(firstVictorReveal);
      } else {
        // This is an optional replacement subset chooser, not a pay/decline pair.
        Victor.chooseOptions();
      }
      game.untilIdle();

      // Accept: spend old Gold, win the replacement and second clashes, create
      // new Gold and draw the second reveal. Decline: split wins, no new tokens.
      expectFabPlayer(Victor)
        .toHaveTokenCount("might", acceptReplacement ? 1 : 0)
        .toHaveTokenCount("vigor", acceptReplacement ? 1 : 0)
        .toHaveHandCount(acceptReplacement ? 1 : 0)
        .toHaveLife(19);
      if (acceptReplacement) {
        expectFabPlayer(Victor).toHaveTokenCount("gold", 1);
        expectFabCard(Victor, ragingOnslaughtRed).toBeIn("hand");
      } else {
        // Seeded real-module tokens retain their catalog id; the token-count
        // helper addresses created token:<slug> objects, so name the old card.
        expectFabCard(Victor, gold).toBeIn("arena");
      }
      expectFabPlayer(Dash)
        .toHaveTokenCount("gold", 0)
        .toHaveTokenCount("might", 0)
        .toHaveTokenCount("vigor", 0);
    },
  );

  it("interaction: Victor's Gold trigger draws his second clash reveal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: [snatchRed, nimblismBlue] },
      {
        hero: victorGoldmane,
        hand: [trounceRed],
        deck: [ragingOnslaughtRed, commandAndConquerRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Victor = game.as(victorGoldmane);

    Dash.playAttack(snatchRed);
    Victor.defendWith(trounceRed);
    game.untilIdle();

    expectFabPlayer(Victor)
      .toHaveTokenCount("gold", 1)
      .toHaveTokenCount("might", 1)
      .toHaveTokenCount("vigor", 1)
      .toHaveHandCount(1)
      .toHaveLife(19);
    expectFabCard(Victor, ragingOnslaughtRed).toBeIn("hand");
    expectFabPlayer(Dash)
      .toHaveTokenCount("gold", 0)
      .toHaveTokenCount("might", 0)
      .toHaveTokenCount("vigor", 0);
  });

  it.each([
    {
      winner: "attacker",
      firstAttackReveal: commandAndConquerRed,
      firstDefendReveal: nimblismBlue,
    },
    {
      winner: "defender",
      firstAttackReveal: nimblismBlue,
      firstDefendReveal: commandAndConquerRed,
    },
  ])(
    "boundary: a second clash tie gives no reward after $winner won first",
    ({ firstAttackReveal, firstDefendReveal }) => {
      const game = FabTestEngine.start(
        { hero: dash, hand: [snatchRed], deck: [snatchRed, firstAttackReveal] },
        { hero: bravo, hand: [trounceRed], deck: [snatchRed, firstDefendReveal] },
        { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
      );
      const Dash = game.as(dash);
      const Bravo = game.as(bravo);

      Dash.playAttack(snatchRed);
      Bravo.defendWith(trounceRed);
      game.untilIdle();

      expectFabPlayer(Dash)
        .toHaveTokenCount("gold", 0)
        .toHaveTokenCount("might", 0)
        .toHaveTokenCount("vigor", 0);
      expectFabPlayer(Bravo)
        .toHaveTokenCount("gold", 0)
        .toHaveTokenCount("might", 0)
        .toHaveTokenCount("vigor", 0)
        .toHaveLife(19);
    },
  );

  it.each([
    {
      firstResult: "defender wins",
      attackerDeck: [commandAndConquerRed, nimblismBlue],
      defenderDeck: [snatchRed, commandAndConquerRed],
      secondReveal: commandAndConquerRed,
    },
    {
      firstResult: "attacker wins",
      attackerDeck: [nimblismBlue, commandAndConquerRed],
      defenderDeck: [commandAndConquerRed, snatchRed],
      secondReveal: nimblismBlue,
    },
    {
      firstResult: "tie",
      attackerDeck: [commandAndConquerRed, nimblismBlue],
      defenderDeck: [snatchRed, nimblismBlue],
      secondReveal: commandAndConquerRed,
    },
  ])(
    "timing: after $firstResult, Snatch draws the second reveal",
    ({ attackerDeck, defenderDeck, secondReveal }) => {
      // Trounce's printed instruction moves the first reveals only. CR 8.5.45
      // reveals for the second clash without moving those cards. Snatch's hit
      // therefore draws the second reveal, not the first reveal.
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [snatchRed],
          deck: attackerDeck,
        },
        {
          hero: bravo,
          hand: [trounceRed],
          deck: defenderDeck,
        },
        { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
      );
      const Dash = game.as(dash);
      const Bravo = game.as(bravo);

      Dash.playAttack(snatchRed);
      Bravo.defendWith(trounceRed);
      game.untilIdle({ optionals: "decline", ordering: "listed" });

      expectFabPlayer(Bravo).toHaveLife(19);
      expectFabPlayer(Dash).toHaveHandCount(1);
      expectFabCard(Dash, secondReveal).toBeIn("hand");
      expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
      expectFabPlayer(Dash).toHaveTokenCount("might", 0);
      expectFabPlayer(Dash).toHaveTokenCount("vigor", 0);
      expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
      expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
      expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
    },
  );

  it("happy: winning both clashes would mint Gold, Might, and Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        deck: [commandAndConquerRed, commandAndConquerRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1);
  });

  it("boundary: a split clash pair does not mint the token trio", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        // Last entry is top: first clash reveals Nimblism, second Command and Conquer.
        deck: [commandAndConquerRed, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        // Last entry is top: first clash reveals Command and Conquer, second Nimblism.
        deck: [nimblismBlue, commandAndConquerRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 0);
  });

  it("happy: the attacking hero winning both clashes mints the token trio", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [commandAndConquerRed, commandAndConquerRed],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        deck: [nimblismBlue, nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("gold", 1);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
  });

  it("boundary: a first-clash tie then a second clash mints nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [commandAndConquerRed, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        deck: [commandAndConquerRed, nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 0);
  });
});
