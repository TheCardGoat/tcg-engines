import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { evoCommandCenterYellow } from "./evo-command-center.ts";

/**
 * Evo Command Center (EVO034) — Mechanologist Action Evo Head d3.
 *
 * Printed: If you have a base head equipped, transform it into this, then
 * equip this. Once per Turn Instant - Destroy a card under this: Your next
 * weapon attack this turn gets "When this hits, draw a card."
 */

describe("Evo Command Center (EVO034) AAA", () => {
  it("happy: with a base head equipped, this transforms into the head slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        weapon1: [tekloBlaster],
        hand: [evoCommandCenterYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoCommandCenterYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoCommandCenterYellow).toBeIn("head");
    expect(Teklo.zone("head")).not.toContain(tekloBaseHead.canonicalId);
  });

  it("boundary: Instant destroy-under-this is unpayable with no card under this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoCommandCenterYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).expectActivationRejected(evoCommandCenterYellow);
  });

  it("timing: without paying destroy-under-this the next weapon hit does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoCommandCenterYellow],
        weapon1: [tekloBlaster],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 8,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const handBefore = Teklo.zone("hand").length;
    Teklo.activateAttack(tekloBlaster);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Teklo).toHaveHandCount(handBefore);
  });
});
