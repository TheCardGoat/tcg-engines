import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassai } from "../heroes/kassai.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { cutTheDeckRed } from "./cut-the-deck.ts";

/**
 * Cut the Deck (HVY106) — Warrior Attack Reaction, cost 1, 3{d}.
 *
 * Printed: Target Warrior attack gets +3{p}. If it's defended by an attack
 * action card, draw a card, then put a card from your hand or arsenal on the
 * bottom of your deck.
 *
 * Draw then put-on-bottom is the AAC-defend branch (printed "If it's defended
 * by an attack action card, draw a card, then put a card…").
 */

describe("cut-the-deck family AAA", () => {
  it("happy: a Warrior attack defended by an attack action gets +3", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [cutTheDeckRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.must.defend(snatchRed);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(cutTheDeckRed);
    game.passBoth();
    Kassai.target(brutalAssaultBlue);

    // Cintari 2 + defended-by-attack-action +1 + Cut the Deck +3 = 6.
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Kassai, cutTheDeckRed).toBeIn("graveyard");
    expect(Kassai.cardsIn("deck", brutalAssaultBlue).length).toBe(1);
    expectFabCard(Kassai, snatchRed).toBeIn("hand");
  });

  it("boundary: a non-Warrior attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [cutTheDeckRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Kassai.must.playReaction(cutTheDeckRed));
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, cutTheDeckRed).toBeIn("hand");
  });

  it("timing: an undefended Warrior attack still gets +3 and does not put a card on the bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [cutTheDeckRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(cutTheDeckRed);
    game.passBoth();
    Kassai.target(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, brutalAssaultBlue).toBeIn("hand");
  });
});
