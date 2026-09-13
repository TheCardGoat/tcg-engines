import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { swordmasterSShineRed } from "./swordmaster-s-shine.ts";

/**
 * Swordmaster's Shine Red (PEN048) — Warrior Attack Reaction.
 *
 * Printed:
 *   This costs {r} less to play for each +1{p} counter on swords you control.
 *   Target weapon attack gets +5{p}.
 */

describe("Swordmaster's Shine (PEN048) AAA", () => {
  it("happy: target weapon attack gets +5 power", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [swordmasterSShineRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(swordmasterSShineRed);
    game.passBoth();

    // Cintari Saber base 2 + 5 = 7.
    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Kassai, swordmasterSShineRed).toBeIn("graveyard");
  });

  it("boundary: cannot pay the unreduced cost of 3", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [swordmasterSShineRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");

    // Activation spent 1{r}; 2 remain, printed cost is 3.
    expect(() => Kassai.must.playReaction(swordmasterSShineRed)).toThrow();
  });

  it("interaction: one +1{p} counter on a sword reduces cost by 1 — pay 2 after weapon pay", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        // Fixture stores total as value=N count=1; cost-reduction matches value=1 counters.
        weapon1: [{ card: cintariSaber, state: { powerCounterTotal: 1 } }],
        hand: [swordmasterSShineRed],
        // 1{r} for the saber activation; Shine cost 3 − 1 counter = 2.
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(swordmasterSShineRed);
    game.passBoth();

    // Cintari Saber base 2 + 1 counter + 5 AR = 8.
    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Kassai, swordmasterSShineRed).toBeIn("graveyard");
    expect(Kassai.resourcePoints()).toBe(0);
  });
});
