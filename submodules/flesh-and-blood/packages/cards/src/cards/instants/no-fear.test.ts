import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { wreckerRompBlue } from "../actions/wrecker-romp.ts";
import { noFearRed } from "./no-fear.ts";

/**
 * No Fear (HVY016) — Brute Instant.
 *
 * Printed delayed effect: cards with 6+ power banished as the additional cost
 * return at the beginning of the end phase. The next damage this turn is
 * prevented by 2 plus the number banished.
 */

function playNoFearDuringAttack(
  game: FabTestEngine,
  banish: readonly (typeof commandAndConquerRed)[],
): void {
  const Dash = game.as(dash);
  const Rhinar = game.as(rhinar);

  Dash.attackWith(brutalAssaultRed);
  game.toReaction("defender");
  Rhinar.play(noFearRed, { anyNumberBanishCostCards: banish });
  game.passBoth();
}

describe("No Fear (HVY016) AAA", () => {
  it("happy: two banished cards prevent 4 damage and return at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: rhinar,
        hand: [noFearRed, commandAndConquerRed, wreckerRompBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);

    playNoFearDuringAttack(game, [commandAndConquerRed, wreckerRompBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveLife(18).toHaveHandCount(0);
    expectFabCard(Rhinar, commandAndConquerRed).toBeIn("banished");
    expectFabCard(Rhinar, wreckerRompBlue).toBeIn("banished");

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Rhinar, commandAndConquerRed).toBeIn("hand");
    expectFabCard(Rhinar, wreckerRompBlue).toBeIn("hand");
  });

  it("boundary: banishing zero cards still prevents the base 2 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: rhinar, hand: [noFearRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Rhinar = game.as(rhinar);

    playNoFearDuringAttack(game, []);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveLife(16);
  });

  it("timing: prevention is consumed by the first damage packet this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultRed, brutalAssaultRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: rhinar,
        hand: [noFearRed, commandAndConquerRed, wreckerRompBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    playNoFearDuringAttack(game, [commandAndConquerRed, wreckerRompBlue]);
    game.closeCombat({ ordering: "listed" });
    Dash.attackWith(brutalAssaultRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveLife(12);
  });
});
