import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { drawACrowdBlue } from "./draw-a-crowd.ts";

/**
 * Draw a Crowd Blue (MPG044) — Guardian Action Aura. Go again.
 *
 * Printed: When this enters the arena, each hero draws a card.
 */

describe("Draw a Crowd (MPG044) AAA", () => {
  it("happy: entering, each hero draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [drawACrowdBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(drawACrowdBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Bravo, drawACrowdBlue).toBeIn("arena");
    // Both heroes drew: controller hand 1 (drew to replace the aura), and
    // the opponent's empty hand gained one card.
    expectFabPlayer(Bravo).toHaveHandCount(1);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });
});
