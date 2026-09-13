import { describe, it } from "vitest";
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
import { villainousPoseRed } from "./villainous-pose.ts";

/**
 * Villainous Pose (SUP120) — Reviled Action, cost 2, 2{d}, go again.
 *
 * Printed: "Your next attack this turn gets +4{p}. The crowd boos you. Go again"
 */

describe("Villainous Pose family AAA", () => {
  it("happy: next attack this turn gets +4{p} and the crowd boos (Vigor)", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [villainousPoseRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.play(villainousPoseRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Kayo).toHaveTokenCount("vigor", 1);

    Kayo.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a second attack this turn stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [villainousPoseRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.play(villainousPoseRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Kayo.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
    game.helpers.resolveRestOfCombat();

    Kayo.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [villainousPoseRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    expectFabPlayer(Kayo).toHaveAP(1);
    Kayo.play(villainousPoseRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Kayo).toHaveAP(1);
    expectFabCard(Kayo, villainousPoseRed).toBeIn("graveyard");
  });
});
