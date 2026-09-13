import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { sledgeOfAnvilheim } from "./sledge-of-anvilheim.ts";

describe("Sledge of Anvilheim (CRU024) AAA", () => {
  it("happy: pay 4 resources to attack for 4", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [sledgeOfAnvilheim],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(sledgeOfAnvilheim);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("boundary: the attack does not have go again, so a second swing needs another action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [sledgeOfAnvilheim],
        resourcePoints: 8,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(sledgeOfAnvilheim);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveAP(0);
    Bravo.expectActivationRejected(sledgeOfAnvilheim);
  });
});
