import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { malignRed } from "../actions/malign.ts";
import { snatchRed } from "../actions/snatch.ts";
import { arakni5lP3d7hru7h3Cr4x } from "./arakni-5l-p3d-7hru-7h3-cr4x.ts";

/**
 * Arakni, 5L!p3d 7hRu 7h3 cR4X (AAC001) — Chaos Assassin Hero.
 *
 * Printed: The first attack with stealth each turn gets go again.
 */

describe("Arakni, 5L!p3d 7hRu 7h3 cR4X (AAC001) AAA", () => {
  it("happy: the first stealth attack each turn gets go again", () => {
    const game = FabTestEngine.start(
      { hero: arakni5lP3d7hru7h3Cr4x, hand: [malignRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni5lP3d7hru7h3Cr4x);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");

    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: a non-stealth first attack does not get go again", () => {
    const game = FabTestEngine.start(
      { hero: arakni5lP3d7hru7h3Cr4x, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni5lP3d7hru7h3Cr4x);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: a second stealth attack the same turn does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni5lP3d7hru7h3Cr4x,
        hand: [malignRed, malignRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni5lP3d7hru7h3Cr4x);

    Arakni.attackWith(Arakni.cardsIn("hand", malignRed)[0]!);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveAP(1);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");

    expectCombat(game).notToHaveKeyword("go-again");
  });
});
