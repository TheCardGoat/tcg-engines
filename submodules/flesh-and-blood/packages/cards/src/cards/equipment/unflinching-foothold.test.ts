import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { bareDestructionRed } from "../actions/bare-destruction.ts";
import { heraldOfTriumphRed } from "../actions/herald-of-triumph.ts";
import { predatoryAssaultRed } from "../actions/predatory-assault.ts";
import { unflinchingFoothold } from "./unflinching-foothold.ts";

/**
 * Unflinching Foothold (PEN318) — Generic Legs battleworn.
 *
 * Printed:
 *   Instant - Destroy this: Target attack loses and can't gain dominate.
 *
 * Dominate vehicle: CRU013 Predatory Assault's printed conditional (dominate
 * only after a 6+{p} discard this turn — FIX-5 removed the unprinted static
 * keyword), qualified via the beat-chest arrange proven in the CRU013 suite.
 */

describe("Unflinching Foothold (PEN318) AAA", () => {
  it("happy: defender destroys this and the attacking dominate attack loses dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareDestructionRed, heraldOfTriumphRed, predatoryAssaultRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, legs: [unflinchingFoothold], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    // Qualify CRU013's printed conditional: beat chest on Bare Destruction,
    // discarding Herald of Triumph (7{p}) — the idiom proven in the CRU013 suite.
    const heraldId = Rhinar.findCardInZone("hand", heraldOfTriumphRed);
    Rhinar.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: heraldId,
      target: Dash.id,
    });
    game.helpers.resolveUntilIdle();

    Rhinar.attackWith(predatoryAssaultRed);
    expectCombat(game).toHaveKeyword("dominate");
    game.advanceCombatTo("reaction");
    Rhinar.pass();
    Dash.activate(unflinchingFoothold);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, unflinchingFoothold).toBeIn("graveyard");
    expectCombat(game).notToHaveKeyword("dominate");
  });

  it("boundary: cannot activate with no open attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [unflinchingFoothold], actionPoints: 1, deck: 6 },
      { hero: rhinar, hand: [], deck: 6 },
    );

    expect(() => game.as(dash).activate(unflinchingFoothold)).toThrow();
    expectFabCard(game.as(dash), unflinchingFoothold).toBeIn("legs");
  });

  it("timing: Instant destroy spends no action point for the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bareDestructionRed, heraldOfTriumphRed, predatoryAssaultRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        legs: [unflinchingFoothold],
        actionPoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    // Same qualifying discard so the link genuinely carries dominate before
    // the defender's no-AP-cost destroy strips it.
    const heraldId = Rhinar.findCardInZone("hand", heraldOfTriumphRed);
    Rhinar.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: heraldId,
      target: Dash.id,
    });
    game.helpers.resolveUntilIdle();

    Rhinar.attackWith(predatoryAssaultRed);
    expectCombat(game).toHaveKeyword("dominate");
    game.advanceCombatTo("reaction");
    Rhinar.pass();
    Dash.activate(unflinchingFoothold);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, unflinchingFoothold).toBeIn("graveyard");
    expectCombat(game).notToHaveKeyword("dominate");
  });
});
