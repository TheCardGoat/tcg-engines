import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { smellFearBlue } from "../actions/smell-fear.ts";
import { rawhideRumbleRed } from "../actions/rawhide-rumble.ts";
import { echoCasque } from "./echo-casque.ts";

/**
 * Echo Casque — Brute Equipment - Head, d1 Battleworn.
 *
 * Printed: "Whenever you beat chest, you may pay {r} and destroy this.
 * If you do, draw a card."
 * Smell Fear's printed Beat Chest is the real beat-chest event; the cost
 * discards a 6{p} card (Rawhide Rumble Red).
 */

describe("Echo Casque (ARR003) AAA", () => {
  it("happy: beating chest pays {r} and destroys this to draw a card", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [echoCasque],
        hand: [smellFearBlue, rawhideRumbleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const rawhideId = Rhinar.findCardInZone("hand", rawhideRumbleRed);

    Rhinar.play(smellFearBlue, { beatChest: true, beatChestInstanceId: rawhideId });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Rhinar, echoCasque).toBeIn("graveyard");
    // 2 hand cards − Smell Fear played − 1 Beat Chest discard + 1 draw = 1.
    expect(Rhinar.zone("hand")).toHaveLength(1);
    // The {r} was paid from the seeded resource point.
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
  });

  it("boundary: without beating chest the casque stays equipped and does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [echoCasque],
        hand: [smellFearBlue, rawhideRumbleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(smellFearBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Rhinar, echoCasque).toBeIn("head");
    expect(Rhinar.zone("hand")).toHaveLength(1);
    expectFabPlayer(Rhinar).toHaveResourceCount(1);
  });
});
