import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { cullRed } from "../actions/cull.ts";
import { leviaRedeemed } from "./levia-redeemed.ts";

/**
 * Levia, Redeemed (DTD164) — Shadow Demi-Hero (Levia Specialization),
 * Legendary.
 *
 * Printed: "Action - Turn all cards in your banished zone face-down:
 * Transform into Levia, Redeemed. Activate this only while this is in your
 * inventory and you have 13 or more cards with blood debt in your banished
 * zone. Cards you own lose blood debt."
 */

const bloodDebtBanished = (count: number) => Array.from({ length: count }, () => cullRed);

describe("Levia, Redeemed (DTD164) AAA", () => {
  it("happy: turning 13 blood-debt cards face-down transforms Levia into Redeemed", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: levia,
        inventory: [leviaRedeemed],
        banished: bloodDebtBanished(13),
        life: 38,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);

    Levia.activate(leviaRedeemed);
    game.helpers.resolveUntilIdle();

    // The specialization took the hero seat with the banished zone face-down.
    expect(Levia.zone("heroZone")).toContain(leviaRedeemed.canonicalId);
    expectFabCard(Levia, Levia.cardsIn("banished", cullRed)[0]!).toBeFaceDown();
  });

  it("boundary: the activation needs 13 blood-debt cards in the banished zone", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: levia,
        inventory: [leviaRedeemed],
        banished: bloodDebtBanished(12), // one short of the printed 13
        life: 38,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.activate(leviaRedeemed), /condition|activat|legal|inventory/i);
    expect(Levia.zone("heroZone")).not.toContain(leviaRedeemed.canonicalId);
  });

  it("timing: after transforming, blood debt no longer drains life at the end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: levia,
        inventory: [leviaRedeemed],
        banished: bloodDebtBanished(13),
        life: 38,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);

    Levia.activate(leviaRedeemed);
    game.helpers.resolveUntilIdle();
    expect(Levia.zone("heroZone")).toContain(leviaRedeemed.canonicalId);

    Levia.endTurn();
    game.helpers.untilIdle();

    // "Cards you own lose blood debt": the 13 banished blood-debt cards
    // collect nothing at the end phase.
    expectFabPlayer(Levia).toHaveLife(38);
  });
});
