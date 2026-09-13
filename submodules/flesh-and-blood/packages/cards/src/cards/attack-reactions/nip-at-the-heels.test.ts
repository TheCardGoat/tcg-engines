import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { snatchYellow } from "../actions/snatch.ts";
import { nipAtTheHeelsBlue } from "./nip-at-the-heels.ts";

/**
 * Nip at the Heels Blue (HNT239) — Generic Attack Reaction.
 *
 * Printed:
 *   Target attack with 3 or less base {p} gets +1{p}.
 */

describe("Nip at the Heels (HNT239) AAA", () => {
  it("happy: attack with base power 3 or less gets +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [nipAtTheHeelsBlue, snatchYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchYellow);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(nipAtTheHeelsBlue);
    game.passBoth();

    // Snatch Yellow base 3 + 1 = 4.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, nipAtTheHeelsBlue).toBeIn("graveyard");
  });

  it("boundary: cannot target an attack with base power 4", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [nipAtTheHeelsBlue, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Kassai.must.playReaction(nipAtTheHeelsBlue)).toThrow();
  });
});
