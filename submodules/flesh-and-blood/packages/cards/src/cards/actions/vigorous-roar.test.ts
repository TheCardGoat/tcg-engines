import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { empoweringRuckusYellow } from "./empowering-ruckus.ts";
import { vigorousRoarRed } from "./vigorous-roar.ts";

/**
 * Vigorous Roar (SUP138) — Brute Action, cost 0, 2{d}, go again.
 *
 * Printed: "Your next attack this turn gets +3{p}. If there is a card with
 * 6 or more {p} in your pitch zone, create a Vigor token. Go again"
 */

describe("Vigorous Roar (SUP138) AAA", () => {
  it("happy: a 6{p} card in pitch creates Vigor and the next attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [vigorousRoarRed, brutalAssaultBlue],
        pitch: [empoweringRuckusYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(vigorousRoarRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 1);

    Rhinar.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without a 6+{p} card in pitch, no Vigor is created; the next attack still gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [vigorousRoarRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(vigorousRoarRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Rhinar).toHaveTokenCount("vigor", 0);

    Rhinar.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: go again refunds the action point; a later attack is unbuffed", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [vigorousRoarRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expectFabPlayer(Rhinar).toHaveAP(2);
    Rhinar.play(vigorousRoarRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Rhinar).toHaveAP(2);
    expectFabCard(Rhinar, vigorousRoarRed).toBeIn("graveyard");

    Rhinar.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    Rhinar.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });
});
