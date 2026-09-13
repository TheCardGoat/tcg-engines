import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { rainRazorsYellow } from "./rain-razors.ts";

/**
 * Rain Razors (EVR090) — Ranger Instant, cost 0.
 *
 * Printed: "Arrows have +2{p} while attacking this turn."
 */

describe("Rain Razors (EVR090) AAA", () => {
  it("happy: an arrow attacking this turn has +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [rainRazorsYellow],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(rainRazorsYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Azalea, rainRazorsYellow).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    game.advanceCombatTo("defend");
    // Searing Shot 4 + 2 = 6.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-arrow attack this turn stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [rainRazorsYellow, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(rainRazorsYellow);
    game.helpers.resolveUntilIdle();
    Azalea.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +2{p} is absent until an arrow is actually attacking", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [rainRazorsYellow],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(rainRazorsYellow);
    game.helpers.resolveUntilIdle();
    expectCombat(game).toBeClosed();

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toBeOpen().toHaveAttackPower(6);
  });
});
