import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { envelopInDarknessRed } from "./envelop-in-darkness.ts";
import { mordredTideRed } from "./mordred-tide.ts";

/**
 * Mordred Tide Red (ARC081) — until EOT, Runechant creates are that many plus 1
 * (Errata #5).
 */

describe("Mordred Tide (ARC081) AAA", () => {
  it("happy: creating Runechants this turn instead creates that many plus 1", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [mordredTideRed, envelopInDarknessRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(mordredTideRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Vynnset, mordredTideRed).toBeIn("graveyard");
    // Go again refunds AP for the follow-up create.
    expectFabPlayer(Vynnset).toHaveAP(1);

    Vynnset.play(envelopInDarknessRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    // Printed create 1 → that many plus 1 = 2.
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 2);
  });

  it("boundary: without Mordred Tide a Runechant source creates the printed count", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [envelopInDarknessRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(envelopInDarknessRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 1);
  });
});
