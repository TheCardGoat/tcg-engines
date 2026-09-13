import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseArms } from "../equipment/teklo-base-arms.ts";
import { evoShortcircuitBlue } from "./evo-shortcircuit.ts";

describe("Evo Shortcircuit (MST230) AAA", () => {
  it("happy: transforming a base arms equips this and deals 1 to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        hand: [evoShortcircuitBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Bravo = game.as(bravo);

    Teklo.play(evoShortcircuitBlue);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.target(Bravo);
    game.helpers.resolveUntilIdle();

    expectFabCard(Teklo, evoShortcircuitBlue).toBeIn("arms");
    expect(Teklo.zone("arms")).not.toContain(tekloBaseArms.canonicalId);
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("boundary: without a base arms this does not enter the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoShortcircuitBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoShortcircuitBlue);
    game.helpers.resolveUntilIdle();

    expect(Teklo.zone("arms")).not.toContain(evoShortcircuitBlue.canonicalId);
    expectFabCard(Teklo, evoShortcircuitBlue).toBeIn("graveyard");
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });

  it("timing: the Instant does not spend an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        hand: [evoShortcircuitBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoShortcircuitBlue);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.target(game.as(bravo));
    game.helpers.resolveUntilIdle();

    expectFabCard(Teklo, evoShortcircuitBlue).toBeIn("arms");
    expectFabPlayer(Teklo).toHaveAP(1);
  });
});
