import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { tekloBaseChest } from "../equipment/teklo-base-chest.ts";
import { evoEngineRoomYellow } from "./evo-engine-room.ts";

/**
 * Evo Engine Room (EVO035) — Mechanologist Action Evo Chest d3.
 *
 * Printed: transform equipped base chest into this, then equip this.
 * Once per Turn Instant - Destroy a card under this: Your next weapon attack
 * this turn costs {r} less to activate. Blade Break.
 */

describe("Evo Engine Room (EVO035) AAA", () => {
  it("happy: after destroy-under-this the next weapon attack costs {r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        weapon1: [tekloBlaster],
        hand: [evoEngineRoomYellow],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoEngineRoomYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabCard(Teklo, evoEngineRoomYellow).toBeIn("chest");

    Teklo.activate(evoEngineRoomYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoEngineRoomYellow).toBeIn("chest");
  });

  it("boundary: Instant destroy-under-this is unpayable with no card under this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [evoEngineRoomYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).expectActivationRejected(evoEngineRoomYellow);
  });

  it("timing: without paying destroy-under-this the weapon still costs {r}{r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [evoEngineRoomYellow],
        weapon1: [tekloBlaster],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.expectActivationRejected(evoEngineRoomYellow);
    Teklo.activateAttack(tekloBlaster);
    expectFabPlayer(Teklo).toHaveResourceCount(0);
  });
});
