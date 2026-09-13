import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { marlynn } from "../heroes/marlynn.ts";
import { dash } from "../heroes/dash.ts";
import { goldfinHarpoonYellow } from "./goldfin-harpoon.ts";
import { favorableWindsYellow } from "./favorable-winds.ts";

/**
 * Favorable Winds — Pirate Ranger Action, cost 1, 2{d}.
 *
 * Printed: As an additional cost to play this, discard a Goldfin Harpoon.
 * Draw 2 cards. Go again
 */

describe("Favorable Winds AAA", () => {
  it("happy: discarding a Goldfin Harpoon draws 2 and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [favorableWindsYellow, goldfinHarpoonYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(favorableWindsYellow);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Marlynn, favorableWindsYellow).toBeIn("graveyard");
    expectFabCard(Marlynn, goldfinHarpoonYellow).toBeIn("graveyard");
    expectFabPlayer(Marlynn).toHaveHandCount(2).toHaveAP(1);
  });

  it("boundary: without a Goldfin Harpoon the additional cost cannot be paid", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [favorableWindsYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Marlynn = game.as(marlynn);

    expectFabUnplayable(() => Marlynn.play(favorableWindsYellow));
    expectFabCard(Marlynn, favorableWindsYellow).toBeIn("hand");
  });
});
