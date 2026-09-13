import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { nimblismBlue } from "./nimblism.ts";
import { gorgingShadowbeastRed } from "./gorging-shadowbeast.ts";

/**
 * Gorging Shadowbeast, Red — Shadow Brute Action - Attack, cost 2, 7{p}.
 *
 * Printed: "When this attacks, banish the top card of your deck.\nBlood Debt"
 */

describe("Gorging Shadowbeast AAA", () => {
  it("happy: attacking banishes the top card of your deck", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [gorgingShadowbeastRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const top = Levia.cardIn("deck", nimblismBlue);

    Levia.playAttack(gorgingShadowbeastRed);
    expectFabCard(Levia, top).toBeBanished();

    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("boundary: a miss still banishes the deck top because the clause is on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [gorgingShadowbeastRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);
    const Dash = game.as(dash);
    const top = Levia.cardIn("deck", nimblismBlue);

    Levia.playAttack(gorgingShadowbeastRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabCard(Levia, top).toBeBanished();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
