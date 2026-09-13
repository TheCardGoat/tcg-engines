import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { artOfDesireMindBlue } from "./art-of-desire-mind.ts";

/**
 * Art of Desire: Mind (MST108) — Assassin Action - Attack, cost 0, 1{p}/3{d}.
 * Printed: Stealth. When this hits a hero, banish the top card of their deck.
 * Whenever this banishes a blue card, draw a card and gain 1{h}.
 */

describe("Art of Desire: Mind (MST108) AAA", () => {
  it("happy: a hit that banishes a blue card draws and gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [artOfDesireMindBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [nimblismBlue], life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(artOfDesireMindBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Dash, nimblismBlue).toBeBanished();
    expectFabPlayer(Bravo).toHaveLife(21);
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });

  it("boundary: banishing a non-blue card does not draw or gain life", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [artOfDesireMindBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(artOfDesireMindBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("timing: a miss does not banish the defending deck-top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [artOfDesireMindBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        deckTop: [nimblismBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(artOfDesireMindBlue);
    Dash.defendWith(brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveLife(20);
    expect(Dash.zone("banished")).toHaveLength(0);
    expect(Dash.cardsIn("deck", nimblismBlue)).toHaveLength(1);
  });
});
