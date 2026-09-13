import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";

describe("Alpha Rampage (WTR006) AAA", () => {
  it("happy: discard a random card and intimidate when this attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [alphaRampageRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.attackWith(alphaRampageRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(9);
    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(11);
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabCard(Dash, snatchRed).toBeFaceDown();
  });

  it("boundary: without a card to discard this cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [alphaRampageRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expect(() => Rhinar.attackWith(alphaRampageRed)).toThrow();
    expectFabCard(Rhinar, alphaRampageRed).toBeIn("hand");
  });

  it("timing: intimidate banishes from hand when this attacks, before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [alphaRampageRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(alphaRampageRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Dash, snatchRed).toBeBanished();
    expect(game.combat()?.open).toBe(true);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
