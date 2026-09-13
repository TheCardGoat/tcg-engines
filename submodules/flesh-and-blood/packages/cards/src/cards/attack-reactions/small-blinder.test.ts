import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { smallBlinderBlue } from "./small-blinder.ts";

/**
 * Small Blinder (MPW092) — Warrior Attack Reaction, cost 2, 2{d}.
 *
 * Printed: "Target sword attack gets +2{p} and wagers with the defending
 * hero. The winner creates a Blade Dance token."
 * (CR 8.5.46: the provisional wager winner is the attacker on a hit, else
 * the defender.)
 */

describe("Small Blinder (MPW092) AAA", () => {
  it("happy: the sword attack gets +2{p}, wagers, and a hit awards the Blade Dance to the attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [smallBlinderBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(smallBlinderBlue);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Kassai).toHaveTokenCount("blade-dance", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("blade-dance", 0).toHaveLife(16);
    expectFabCard(Kassai, smallBlinderBlue).toBeIn("graveyard");
  });

  it("boundary: a non-sword attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [smallBlinderBlue, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.playAttack(snatchRed);
    game.toReaction("attacker");

    expectFabUnplayable(() => Kassai.must.playReaction(smallBlinderBlue));
    expectFabCard(Kassai, smallBlinderBlue).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: when the attack is defended, the defender wins the wagered Blade Dance", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [smallBlinderBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(cintariSaber);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.toReaction("attacker");
    Kassai.must.playReaction(smallBlinderBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 power vs 4 defense — no hit, so the defender wins the wager.
    expectFabPlayer(Kassai).toHaveTokenCount("blade-dance", 0).toHaveLife(20);
    expectFabPlayer(Dash).toHaveTokenCount("blade-dance", 1).toHaveLife(20);
  });
});
