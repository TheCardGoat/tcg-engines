import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { forgedForWarYellow } from "./forged-for-war.ts";
import { snatchRed } from "./snatch.ts";
import { imposingVisageBlue } from "./imposing-visage.ts";

describe("Imposing Visage (EVR022) AAA", () => {
  it("happy: paying X=2 searches a cost-2 aura into the arena and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [imposingVisageBlue],
        deck: [snatchRed, snatchRed, forgedForWarYellow, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(imposingVisageBlue, { xValue: 2 });
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: forgedForWarYellow.canonicalId,
    });

    expectFabCard(Bravo, forgedForWarYellow).toBeIn("arena");
    expectFabCard(Bravo, imposingVisageBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: a higher-cost aura is not a legal search target when X is lower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [imposingVisageBlue],
        deck: [snatchRed, snatchRed, forgedForWarYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(imposingVisageBlue, { xValue: 1 });
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("deck")).toContain(forgedForWarYellow.canonicalId);
    expectFabCard(Bravo, imposingVisageBlue).toBeIn("graveyard");
  });
});
