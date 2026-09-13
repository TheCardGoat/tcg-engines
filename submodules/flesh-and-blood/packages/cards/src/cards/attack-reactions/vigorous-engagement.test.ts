import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { vigorousEngagementRed } from "./vigorous-engagement.ts";

/**
 * Vigorous Engagement (HVY118) — Warrior Attack Reaction, cost 1, 2{d}.
 *
 * Printed: "Target Warrior attack gets +3{p}. If it's defended by an attack
 * action card, create a Vigor token."
 */

describe("vigorous-engagement family AAA", () => {
  it("happy: AAC defense gives +3{p} and creates a Vigor token", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [vigorousEngagementRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.must.defend(snatchRed);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(vigorousEngagementRed);
    game.passBoth();

    // Cintari 2 + AAC-defend +1 + Vigorous Engagement +3 = 6.
    expectCombat(game).toHaveAttackPower(6);
    expectFabToken(game, "vigor").toHaveCount(1);
    expectFabCard(Kassai, vigorousEngagementRed).toBeIn("graveyard");
  });

  it("boundary: no AAC defense still gives +3{p} and does not create Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [vigorousEngagementRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(vigorousEngagementRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabToken(game, "vigor").toHaveCount(0);
    expectFabCard(Kassai, vigorousEngagementRed).toBeIn("graveyard");
  });

  it("timing: a Generic attack is not a legal Warrior target", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [vigorousEngagementRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Kassai.play(vigorousEngagementRed));
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabToken(game, "vigor").toHaveCount(0);
    expectFabCard(Kassai, vigorousEngagementRed).toBeIn("hand");
  });
});
