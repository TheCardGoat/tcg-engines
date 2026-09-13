import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { strokeOfForesightRed } from "./stroke-of-foresight.ts";

/**
 * Stroke of Foresight (TEA009) — Warrior Attack Reaction.
 *
 * Printed: Target weapon attack gains +3{p}.
 * Reprise - If the defending hero has defended with a card from their hand
 * this chain link, draw a card, then put a card from your hand on the top
 * or bottom of your deck.
 */

describe("stroke-of-foresight family AAA", () => {
  it("happy: target weapon attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [strokeOfForesightRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.passBoth();
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(strokeOfForesightRed);
    game.passBoth();

    // Cintari Saber base 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, strokeOfForesightRed).toBeIn("graveyard");
  });

  it("boundary: cannot play targeting a non-weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [strokeOfForesightRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Kassai.play(strokeOfForesightRed));
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, strokeOfForesightRed).toBeIn("hand");
  });

  it("timing: Reprise draws, then puts a card on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [strokeOfForesightRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [brutalAssaultBlue],
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.activate(cintariSaber);
    game.passBoth();
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(strokeOfForesightRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    Kassai.choose("option-0");
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kassai).toHaveHandCount(0);
    expect(Kassai.cardsIn("deck", brutalAssaultBlue).length).toBeGreaterThan(0);
    expectFabCard(Kassai, strokeOfForesightRed).toBeIn("graveyard");
  });
});
