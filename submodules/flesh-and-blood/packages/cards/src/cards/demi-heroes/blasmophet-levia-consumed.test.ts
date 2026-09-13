import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { cullRed } from "../actions/cull.ts";
import { blasmophetLeviaConsumed } from "./blasmophet-levia-consumed.ts";

/**
 * Blasmophet, Levia Consumed (DTD164) — Shadow Demi-Hero - Demon (Levia
 * Specialization), Legendary Transform.
 *
 * Printed: "While this is in your inventory, when blood debt reduces your
 * {h} to 13, you may transform into Blasmophet, Levia Consumed."
 *
 * The remaining printed legs (once-per-turn play from banished, turning
 * banished cards face-down, the blood-debt life-loss replacement) are
 * recorded as gap transform/blasmophet-legs-unreachable-post-transform.
 */

describe("Blasmophet, Levia Consumed (DTD164) AAA", () => {
  it("happy: when blood debt reduces Levia to 13, she may transform into Blasmophet", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: levia,
        inventory: [blasmophetLeviaConsumed],
        banished: [cullRed], // blood debt collects at the end phase
        life: 14,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.helpers.resolveUntilIdle({ optionals: "accept", ordering: "listed" });

    // Blood debt drained 14 -> 13 and the specialization took the hero seat.
    expectFabPlayer(Levia).toHaveLife(13);
    expect(Levia.zone("heroZone")).toContain(blasmophetLeviaConsumed.canonicalId);
    expect(Levia.zone("inventory")).not.toContain(blasmophetLeviaConsumed.canonicalId);
  });

  it("boundary: declining the transform keeps Levia at 13{h}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: levia,
        inventory: [blasmophetLeviaConsumed],
        banished: [cullRed],
        life: 14,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);

    Levia.endTurn();
    game.helpers.resolveUntilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Levia).toHaveLife(13);
    expect(Levia.zone("heroZone")).not.toContain(blasmophetLeviaConsumed.canonicalId);
    expect(Levia.zone("inventory")).toContain(blasmophetLeviaConsumed.canonicalId);
  });
});
