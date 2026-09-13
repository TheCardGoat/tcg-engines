import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { remembranceYellow } from "../instants/remembrance.ts";
import { theWeakestLinkRed } from "./the-weakest-link.ts";

/**
 * The Weakest Link (MST192) — Generic Action Attack, 6{p}.
 *
 * Printed: When this hits a hero, look at their hand and choose a card
 * without base {d}. If you do, they discard it and you draw a card.
 */

describe("The Weakest Link (MST192) AAA", () => {
  it("happy: on hit, choose a card without {d} from their hand; they discard it and you draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [theWeakestLinkRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [sigilOfSolaceRed, remembranceYellow, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(theWeakestLinkRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ entityTargets: "pause" });
    Dash.targetRequired(sigilOfSolaceRed);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabCard(Bravo, sigilOfSolaceRed).toBeIn("graveyard");
    expectFabCard(Bravo, remembranceYellow).toBeIn("hand");
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("boundary: if every card in their hand has {d}, nothing is discarded and you do not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [theWeakestLinkRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(theWeakestLinkRed);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabPlayer(Bravo).toHaveHandCount(2);
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, theWeakestLinkRed).toBeIn("graveyard");
  });

  it("timing: a fully blocked miss does not look at the defending hand", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [theWeakestLinkRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, sigilOfSolaceRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(theWeakestLinkRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, sigilOfSolaceRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveHandCount(0);
  });
});
