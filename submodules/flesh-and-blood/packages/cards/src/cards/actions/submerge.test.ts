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
import { marlynn } from "../heroes/marlynn.ts";
import { nimblismBlue } from "./nimblism.ts";
import { submergeRed } from "./submerge.ts";

/**
 * Submerge, Red (PEN174) — Pirate Attack Action.
 *
 * Printed: "As an additional cost to play this, put a card from your hand
 * into your deck fifth from the top." (cost 0, 6{p}, 3{d})
 */

describe("Submerge family AAA", () => {
  it("happy: putting another hand card fifth from the top pays the cost and this attacks at 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [submergeRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.attackWith(submergeRed);
    expect(Marlynn.cardsIn("deck", nimblismBlue).length).toBeGreaterThan(0);
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: with no other card in hand the required cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [submergeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    expectFabUnplayable(() => Marlynn.play(submergeRed));
    expectFabCard(Marlynn, submergeRed).toBeIn("hand");
  });

  it("timing: the submerged card is still in the deck after combat closes", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [submergeRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.attackWith(submergeRed);
    game.helpers.resolveRestOfCombat();
    expect(Marlynn.cardsIn("deck", nimblismBlue).length).toBeGreaterThan(0);
    expectFabCard(Marlynn, submergeRed).toBeIn("graveyard");
  });
});
