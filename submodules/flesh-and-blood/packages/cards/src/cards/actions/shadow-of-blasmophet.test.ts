import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { deadwoodRumblerRed } from "./deadwood-rumbler.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { levia } from "../heroes/levia.ts";
import { nimblismBlue } from "./nimblism.ts";
import { shadowOfBlasmophetRed } from "./shadow-of-blasmophet.ts";

/**
 * Shadow of Blasmophet (MON125) — Shadow Brute Action - Attack, cost 2, 6{p}.
 *
 * Printed: "Draw a card then discard a random card. If a card with 6 or more
 * {p} is discarded this way, search your deck for a card with blood debt,
 * banish it, then shuffle your deck.
 * Blood Debt"
 */

describe("Shadow of Blasmophet (MON125) AAA", () => {
  it("happy: discarding a 6+ card this way banishes a blood-debt card from the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadowOfBlasmophetRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          deadwoodRumblerRed,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          smashWithBigTreeRed,
        ],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playInstance(Levia.findCardInZone("hand", shadowOfBlasmophetRed), { target: Dash.id });
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: deadwoodRumblerRed.canonicalId,
    });

    expectFabCard(Levia, smashWithBigTreeRed).toBeIn("graveyard");
    expectFabCard(Levia, deadwoodRumblerRed).toBeBanished();
  });

  it("boundary: discarding a sub-6 card does not search the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [shadowOfBlasmophetRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          deadwoodRumblerRed,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
        ],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playInstance(Levia.findCardInZone("hand", shadowOfBlasmophetRed), { target: Dash.id });
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum", optionals: "decline" });

    expectFabCard(Levia, nimblismBlue).toBeIn("graveyard");
    expect(Levia.cardsIn("deck", deadwoodRumblerRed)).toHaveLength(1);
    expectCombat(game).toBeOpen();
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [shadowOfBlasmophetRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, shadowOfBlasmophetRed).toBeBanished();
  });
});
