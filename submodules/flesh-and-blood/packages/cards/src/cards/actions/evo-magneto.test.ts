import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseArms } from "../equipment/teklo-base-arms.ts";
import { optekalMonocleBlue as optekalMonocle } from "./optekal-monocle.ts";
import { snatchRed } from "./snatch.ts";
import { evoMagnetoBlue } from "./evo-magneto.ts";

/**
 * Evo Magneto (HVY248) — Mechanologist Action Equipment Evo Arms.
 * Printed: If you have a base arms equipped, transform it into this, then
 * equip this. When this defends, you may destroy a card under it. If you do,
 * gain control of target item with cost 0 or 1 controlled by the attacking
 * hero. Temper.
 */

describe("Evo Magneto (HVY248) AAA", () => {
  it("happy: with a base arms equipped, this transforms into the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        hand: [evoMagnetoBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoMagnetoBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoMagnetoBlue).toBeIn("arms");
    expect(Teklo.zone("arms")).not.toContain(tekloBaseArms.canonicalId);
  });

  it("boundary: without a base arms equipped this does not enter the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoMagnetoBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoMagnetoBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Teklo.zone("arms")).not.toContain(evoMagnetoBlue.canonicalId);
  });

  it("timing: defending may destroy a card under it to steal a cost-0 item", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        arena: [optekalMonocle],
        deck: 6,
      },
      {
        hero: teklovossen,
        arms: [evoMagnetoBlue],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).playAttack(snatchRed);
    Teklo.defendWith(evoMagnetoBlue);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Teklo, evoMagnetoBlue).toBeIn("arms");
  });
});
