import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { deadwoodRumblerRed } from "./deadwood-rumbler.ts";

/**
 * Deadwood Rumbler (LEV010) — Shadow Brute Action - Attack, cost 3, 8{p}.
 *
 * Printed: "Draw a card then discard a random card. If a card with 6 or more
 * {p} is discarded this way, banish a card from a graveyard.
 * Blood Debt"
 */

describe("Deadwood Rumbler family AAA", () => {
  it("happy: discarding a 6+ card this way banishes a graveyard card", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [deadwoodRumblerRed],
        graveyard: [brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [
          smashWithBigTreeRed,
          smashWithBigTreeRed,
          smashWithBigTreeRed,
          smashWithBigTreeRed,
          smashWithBigTreeRed,
          smashWithBigTreeRed,
        ],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playInstance(Levia.findCardInZone("hand", deadwoodRumblerRed), { target: Dash.id });
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: brutalAssaultBlue.canonicalId,
    });

    expectFabCard(Levia, brutalAssaultBlue).toBeBanished();
    expectFabCard(Levia, smashWithBigTreeRed).toBeIn("graveyard");
  });

  it("boundary: discarding a sub-6 card does not banish from a graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [deadwoodRumblerRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);

    Levia.playInstance(Levia.findCardInZone("hand", deadwoodRumblerRed), { target: Dash.id });
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum", optionals: "decline" });

    expectFabCard(Levia, nimblismBlue).toBeIn("graveyard");
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(8);
  });

  it("timing: Blood Debt — an unplayed copy in the banished zone drains 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [],
        banished: [deadwoodRumblerRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.helpers.untilIdle();
    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, deadwoodRumblerRed).toBeBanished();
  });
});
