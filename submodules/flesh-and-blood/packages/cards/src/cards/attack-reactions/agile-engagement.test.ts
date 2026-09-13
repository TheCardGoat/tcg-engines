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
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { agileEngagementRed } from "./agile-engagement.ts";

/**
 * Agile Engagement (HVY115) — Warrior Attack Reaction, cost 1, 2{d}.
 *
 * Printed: "Target Warrior attack gets +3{p}. If it's defended by an attack
 * action card, create an Agility token."
 */

describe("agile-engagement family AAA", () => {
  it("happy: AAC defense gives +3{p} and creates an Agility token", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [agileEngagementRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.must.defend(snatchRed);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(agileEngagementRed);
    game.passBoth();

    // Cintari 2 + AAC-defend +1 + Agile Engagement +3 = 6.
    expectCombat(game).toHaveAttackPower(6);
    expectFabToken(game, "agility").toHaveCount(1);
    expectFabCard(Kassai, agileEngagementRed).toBeIn("graveyard");
  });

  it("boundary: no AAC defense still gives +3{p} and does not create Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [agileEngagementRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(agileEngagementRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabToken(game, "agility").toHaveCount(0);
    expectFabCard(Kassai, agileEngagementRed).toBeIn("graveyard");
  });

  it("timing: a Generic attack is not a legal Warrior target", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [agileEngagementRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Kassai.play(agileEngagementRed));
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabToken(game, "agility").toHaveCount(0);
    expectFabCard(Kassai, agileEngagementRed).toBeIn("hand");
  });
});
