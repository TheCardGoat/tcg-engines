import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { longswordLeggings } from "./longsword-leggings.ts";

/**
 * Longsword Leggings — Warrior Legs d1 Battleworn.
 *
 * Printed: "Action - Destroy this: Create a Blade Dance or Flurry token.
 * Battleworn"
 */

describe("Longsword Leggings AAA", () => {
  it("happy: choosing Blade Dance destroys the leggings and creates that token", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, legs: [longswordLeggings], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(longswordLeggings);
    game.passBoth(); // resolve the Action layer: the token choice surfaces
    Dori.choose("blade-dance");
    game.passBoth();

    expectFabCard(Dori, longswordLeggings).toBeIn("graveyard");
    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 1);
    expectFabPlayer(Dori).toHaveTokenCount("flurry", 0);
  });

  it("boundary: choosing Flurry creates the other token instead", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, legs: [longswordLeggings], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(longswordLeggings);
    game.passBoth(); // resolve the Action layer: the token choice surfaces
    Dori.choose("Flurry");
    game.passBoth();

    expectFabPlayer(Dori).toHaveTokenCount("flurry", 1);
    expectFabPlayer(Dori).toHaveTokenCount("blade-dance", 0);
  });

  it("keyword: Battleworn puts a -1{d} counter on the leggings after they defend", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, legs: [longswordLeggings], hand: [], deck: 6 },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Dori.defendWith(longswordLeggings);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dori, longswordLeggings).toHaveDefenseCounters(-1);
    expectFabCard(Dori, longswordLeggings).toBeIn("legs");
  });
});
