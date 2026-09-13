import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { nimblismBlue } from "./nimblism.ts";
import { shadowrealmHorrorRed } from "./shadowrealm-horror.ts";

/**
 * Shadowrealm Horror (MST236) — Shadow Brute Action - Attack, cost 2, 6{p}.
 *
 * Printed: As an additional cost to play this, banish 3 random cards in your
 * graveyard. If 1 or more cards with 6 or more {p} are banished this way, this
 * gets +1{p}. 2 or more, this gets go again. 3 or more, you may play a card
 * banished this way this turn. Blood Debt.
 */

describe("Shadowrealm Horror (MST236) AAA", () => {
  it("happy: banishing three 6+ cards this way grants +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadowrealmHorrorRed],
        graveyard: [smashWithBigTreeRed, smashWithBigTreeRed, smashWithBigTreeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playInstance(Levia.findCardInZone("hand", shadowrealmHorrorRed), { target: Dash.id });
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum", optionals: "decline" });

    expect(Levia.cardsIn("banished", smashWithBigTreeRed)).toHaveLength(3);
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(7);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: an empty graveyard cannot pay the banish-3 additional cost", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadowrealmHorrorRed],
        graveyard: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.play(shadowrealmHorrorRed));
    expectFabCard(Levia, shadowrealmHorrorRed).toBeIn("hand");
  });

  it("timing: banishing three sub-6 cards this way grants neither +1{p} nor go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadowrealmHorrorRed],
        graveyard: [nimblismBlue, nimblismBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playInstance(Levia.findCardInZone("hand", shadowrealmHorrorRed), { target: Dash.id });
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum", optionals: "decline" });

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
