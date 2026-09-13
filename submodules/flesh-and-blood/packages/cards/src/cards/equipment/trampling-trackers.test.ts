import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { tramplingTrackers } from "./trampling-trackers.ts";
import { bonebreakerBellowRed } from "../actions/bonebreaker-bellow.ts";
import { beastModeRed } from "../actions/beast-mode.ts";

/**
 * Trampling Trackers (ARR006) — Brute Equipment - Legs, Temper.
 *
 * Printed: "Whenever you beat chest, you may destroy this. If you do, create
 * an Agility token."
 */
describe("Trampling Trackers (ARR006) AAA", () => {
  it("happy: beating chest destroys the trackers and creates an Agility token", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [tramplingTrackers],
        hand: [bonebreakerBellowRed, beastModeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.play(bonebreakerBellowRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Rhinar, tramplingTrackers).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 1);
  });

  it("boundary: declining the destroy keeps the trackers and creates no Agility", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        legs: [tramplingTrackers],
        hand: [bonebreakerBellowRed, beastModeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.play(bonebreakerBellowRed, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Rhinar, tramplingTrackers).toBeIn("legs");
    expectFabPlayer(Rhinar).toHaveTokenCount("agility", 0);
  });
});
