import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { invertExistenceBlue } from "../instants/invert-existence.ts";
import { galaxxiBlack } from "./galaxxi-black.ts";

/**
 * Galaxxi Black (CHN003) — Shadow Runeblade Weapon - Sword (2H), 1{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack
 *   If you've played a card from your banished zone this turn, this gets +2{p}.
 *   When this hits a hero, deal 1 arcane damage to them.
 */

describe("Galaxxi Black (CHN003) AAA", () => {
  it("happy: after a banished play the sword swings at 3{p} and its hit deals 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        weapon1: [galaxxiBlack],
        banished: [invertExistenceBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(invertExistenceBlue, { from: "banished" });
    game.helpers.untilIdle({ optionals: "decline" });

    Chane.activateAttack(galaxxiBlack);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 3 attack damage + 1 arcane from the hit.
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: without a banished play the sword swings at 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        weapon1: [galaxxiBlack],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.activateAttack(galaxxiBlack);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 1 attack damage + 1 arcane from the hit.
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("timing: the +2{p} lapses at end of turn — next turn the sword is back to 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        weapon1: [galaxxiBlack],
        banished: [invertExistenceBlue],
        hand: [browbeatBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(invertExistenceBlue, { from: "banished" });
    game.helpers.untilIdle({ optionals: "decline" });
    Chane.activateAttack(galaxxiBlack);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(16);

    Chane.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });
    Dash.endTurn();
    game.helpers.untilIdle({ optionals: "decline" });

    Chane.activate(galaxxiBlack);
    game.answerDecision(Chane.id, {
      kind: "payment",
      instanceIds: [Chane.findCardInZone("hand", browbeatBlue)],
    });
    game.advanceUntil({ stopAt: "defend", optionals: "decline", entityTargets: "minimum" });
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(14);
  });
});
