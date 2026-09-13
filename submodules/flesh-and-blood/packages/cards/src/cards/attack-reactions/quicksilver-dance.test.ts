import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { snatchRed } from "../actions/snatch.ts";
import { quicksilverDanceBlue } from "./quicksilver-dance.ts";

/**
 * Quicksilver Dance (MPW047) — Warrior Attack Reaction, cost 1, 3{d}.
 *
 * Printed: "Remove a +1{p} counter from target attacking weapon. If you do,
 * create a Blade Dance token and draw a card."
 */

describe("Quicksilver Dance (MPW047) AAA", () => {
  it("happy: removing a +1{p} counter from the attacking weapon creates Blade Dance and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [quicksilverDanceBlue],
        weapon1: [{ card: cintariSaber, state: { powerCounterTotal: 1 } }],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activateAttack(cintariSaber);
    expectCombat(game).toHaveAttackPower(3);
    game.toReaction("attacker");

    Kassai.must.playReaction(quicksilverDanceBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Kassai, cintariSaber).toHaveCounters(0);
    expectFabPlayer(Kassai).toHaveTokenCount("blade-dance", 1);
    expectFabPlayer(Kassai).toHaveHandCount(1);
    expectFabCard(Kassai, quicksilverDanceBlue).toBeIn("graveyard");
  });

  it("boundary: with no +1{p} counter the if-you-do does not create Blade Dance or draw", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [quicksilverDanceBlue],
        weapon1: [cintariSaber],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activateAttack(cintariSaber);
    expectCombat(game).toHaveAttackPower(2);
    game.toReaction("attacker");

    Kassai.must.playReaction(quicksilverDanceBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Kassai, cintariSaber).toHaveCounters(0);
    expectFabPlayer(Kassai).toHaveTokenCount("blade-dance", 0);
    expectFabPlayer(Kassai).toHaveHandCount(0);
    expectFabCard(Kassai, quicksilverDanceBlue).toBeIn("graveyard");
  });
});
