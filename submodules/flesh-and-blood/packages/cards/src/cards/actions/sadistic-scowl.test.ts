import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { kayoUnderhandedCheat } from "../heroes/kayo-underhanded-cheat.ts";
import { sadisticScowlRed } from "./sadistic-scowl.ts";

/**
 * Sadistic Scowl (SUP095) — Reviled Action, cost 3, 2{d}, go again.
 *
 * Printed: "Your next attack this turn gets +5{p}. Intimidate target hero. Go again"
 */

describe("Sadistic Scowl (SUP095) AAA", () => {
  it("happy: next attack gets +5{p} and intimidate banishes the opposing hero's hand card", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [sadisticScowlRed, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);
    const Dash = game.as(dash);

    Kayo.play(sadisticScowlRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabCard(Dash, snatchRed).toBeFaceDown();

    Kayo.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: a second attack this turn stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [sadisticScowlRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.play(sadisticScowlRed);
    game.helpers.resolveUntilIdle();
    Kayo.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(9);
    game.helpers.resolveRestOfCombat();

    Kayo.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point; empty-hand intimidate banishes nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [sadisticScowlRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);
    const Dash = game.as(dash);

    expectFabPlayer(Kayo).toHaveAP(1);
    Kayo.play(sadisticScowlRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kayo).toHaveAP(1);
    expectFabCard(Kayo, sadisticScowlRed).toBeIn("graveyard");
    expect(Dash.zone("banished")).toHaveLength(0);
  });
});
