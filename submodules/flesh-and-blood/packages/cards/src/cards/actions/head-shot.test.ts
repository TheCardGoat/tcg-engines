import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue, deathDealer } from "../shared/test-recipients.ts";
import { silverTheTipRed } from "./silver-the-tip.ts";
import { nimblismBlue } from "./nimblism.ts";
import { headShotRed } from "./head-shot.ts";

/**
 * ARC057 — Ranger Arrow Attack.
 * Printed: "When this is put into your arsenal face up, it gets +2{p} until
 * end of turn."
 *
 * Both directions below drive REAL arsenal move-zone events:
 * - happy: Silver the Tip look-cohort holds exactly ONE arrow, so its single
 *   face-up put fires once (+2 = printed total).
 * - boundary: an arsenal seat fixture emits no move-zone event; printed base.
 * - face-down orientation gate: matcher-level regression in
 *   packages/engine/src/rules/trigger-matcher.test.ts.
 */

const DECK = [brutalAssaultBlue, brutalAssaultBlue, headShotRed, brutalAssaultBlue] as const;

describe("Head Shot, Red AAA", () => {
  it("happy: its own real face-up arsenal put charges exactly one +2 power", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [silverTheTipRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: [...DECK],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(silverTheTipRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: headShotRed.canonicalId,
      ordering: "listed",
    });
    Azalea.playAttack(headShotRed, { from: "arsenal" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6); // 4 printed + exactly one +2 grant
  });

  it("boundary: an arsenal-seated copy that was never PUT stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [headShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(headShotRed, { from: "arsenal" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +2{p} charge expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        // Resource points do NOT survive the end phase — the next turn's
        // 1-cost arrow pays from an in-hand pitch instead.
        hand: [silverTheTipRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: [...DECK],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(silverTheTipRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: headShotRed.canonicalId,
      ordering: "listed",
    });
    Azalea.endTurn();
    game.as(dash).endTurn();

    // The arrow stays seated into the next turn, but the +2{p} grant does not.
    Azalea.playAttack(headShotRed, { from: "arsenal", pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4); // printed, charge expired
  });
});
