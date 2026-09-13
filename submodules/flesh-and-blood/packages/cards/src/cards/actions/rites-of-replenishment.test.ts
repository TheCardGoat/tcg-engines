import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { ritesOfReplenishmentRed } from "./rites-of-replenishment.ts";

/**
 * Rites of Replenishment (ELE079) — Elemental Runeblade Action - Attack,
 * Earth Fusion, cost 2, 6{p}/3{d}.
 *
 * Printed: When you attack with this, if you have dealt arcane damage this
 * turn, you may put a non-attack action from GY on the bottom of your deck.
 * If fused, you may put an attack action from GY on the bottom of your deck.
 */

describe("Rites of Replenishment (ELE079) AAA", () => {
  it("happy: fused attack may put an attack action from GY on the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ritesOfReplenishmentRed, weaveEarthRed],
        graveyard: [snatchRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(ritesOfReplenishmentRed, {
      fuse: true,
      fuseCards: [weaveEarthRed],
      stopAt: "on-attack",
    });
    Briar.accept();
    Briar.target(snatchRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    expect(Briar.cardsIn("deck", snatchRed)).toHaveLength(1);
    expectFabCard(Briar, nimblismBlue).toBeIn("graveyard");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Briar, ritesOfReplenishmentRed).toBeIn("graveyard");
  });

  it("boundary: unfused, GY cards stay in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ritesOfReplenishmentRed],
        graveyard: [snatchRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(ritesOfReplenishmentRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Briar, snatchRed).toBeIn("graveyard");
    expectFabCard(Briar, nimblismBlue).toBeIn("graveyard");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("timing: fused optional may be declined and the attack action stays in GY", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ritesOfReplenishmentRed, weaveEarthRed],
        graveyard: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(ritesOfReplenishmentRed, {
      fuse: true,
      fuseCards: [weaveEarthRed],
      stopAt: "on-attack",
    });
    Briar.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Briar, snatchRed).toBeIn("graveyard");
    game.closeCombat();
  });
});
