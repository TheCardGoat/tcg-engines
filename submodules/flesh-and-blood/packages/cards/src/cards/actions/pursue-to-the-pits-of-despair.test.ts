import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { pursueToThePitsOfDespairRed } from "./pursue-to-the-pits-of-despair.ts";

describe("Pursue to the Pits of Despair (HNT225) AAA", () => {
  it("happy: hitting a hero marks them", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pursueToThePitsOfDespairRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(pursueToThePitsOfDespairRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(15);
    expectFabPlayer(Bravo).toBeMarked();
  });

  it("boundary: a miss does not mark the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pursueToThePitsOfDespairRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [wreckerRompBlue, wreckerRompBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(pursueToThePitsOfDespairRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([wreckerRompBlue, wreckerRompBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).notToBeMarked();
  });
});
