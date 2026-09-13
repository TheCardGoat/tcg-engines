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
import { snatchRed } from "../actions/snatch.ts";
import { fatalEngagementRed } from "./fatal-engagement.ts";

/**
 * Fatal Engagement Red (HVY109) — Warrior Attack Reaction.
 *
 * Printed:
 *   Play this only if an attack action card is defending this chain link.
 *   Target attack gets +5{p}.
 */

describe("fatal-engagement family AAA", () => {
  it("happy: +5 power when an attack action is defending", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [fatalEngagementRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    // "Target attack" matches attack-action subtypes; weapon proxies do not.
    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.must.defend(snatchRed);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(fatalEngagementRed);
    game.passBoth();

    // Snatch Red base 4 + Fatal +5 = 9.
    expectCombat(game).toHaveAttackPower(9);
    expectFabCard(Kassai, fatalEngagementRed).toBeIn("graveyard");
  });

  it("boundary: cannot play when no attack action is defending", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [fatalEngagementRed],
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

    expect(() => Kassai.must.playReaction(fatalEngagementRed)).toThrow();
  });
});
