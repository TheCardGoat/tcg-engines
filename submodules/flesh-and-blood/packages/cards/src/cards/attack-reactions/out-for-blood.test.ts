import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zeroToSixtyRed } from "../actions/zero-to-sixty.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { outForBloodRed } from "./out-for-blood.ts";

/**
 * Out for Blood (CRU088) — Warrior Attack Reaction.
 * Printed: "Target weapon attack gains +3{p}.
 * Reprise - If the defending hero has defended with a card from their hand
 * this chain link, your next attack this turn gains +1{p}."
 *
 * The defend step precedes the reaction step (CR 7.3.1 → 7.4.2), so the
 * Reprise condition is settled by the time the reaction is played; the +1{p}
 * latch rides the controller's NEXT attack this turn and is consumed by it.
 */

describe("out-for-blood family AAA", () => {
  it("happy: the targeted weapon attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [outForBloodRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.advanceCombatTo("reaction");

    Kassai.must.playReaction(outForBloodRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
  });

  it("reprise: a hand-defended link grants the next attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [outForBloodRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(outForBloodRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    // Reprise latch: the next attack this turn is 4{p} + 1.
    Kassai.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: no hand defense this chain link — no Reprise latch", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [outForBloodRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(outForBloodRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // No card defended from hand → the next attack stays at base 4{p}.
    Kassai.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +1{p} latch is consumed by the next attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [outForBloodRed, snatchRed, zeroToSixtyRed],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(outForBloodRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    Kassai.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    // "Your NEXT attack this turn" — the second attack is plain 4{p}.
    Kassai.attackWith(zeroToSixtyRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
