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
import { tuffnut } from "../heroes/tuffnut.ts";
import { heroicPoseRed } from "./heroic-pose.ts";

/**
 * Heroic Pose (SUP057) — Revered Action, cost 1, 2{d}, go again.
 *
 * Printed: "Your next attack this turn gets +3{p}. The crowd cheers you. Go again"
 */

describe("heroic-pose family AAA", () => {
  it("happy: next attack this turn gets +3{p} and the crowd cheers (Toughness)", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [heroicPoseRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(heroicPoseRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);

    Tuffnut.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a second attack this turn stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [heroicPoseRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(heroicPoseRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Tuffnut.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    Tuffnut.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [heroicPoseRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    expectFabPlayer(Tuffnut).toHaveAP(1);
    Tuffnut.play(heroicPoseRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Tuffnut).toHaveAP(1);
    expectFabCard(Tuffnut, heroicPoseRed).toBeIn("graveyard");
  });
});
