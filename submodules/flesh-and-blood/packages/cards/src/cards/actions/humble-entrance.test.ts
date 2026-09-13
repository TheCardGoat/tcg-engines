import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { humbleEntranceBlue } from "./humble-entrance.ts";

/**
 * Humble Entrance (SUP060) — Revered Action, cost 0, go again.
 * Printed: "Create 3 Toughness tokens."
 */

describe("Humble Entrance (SUP060) AAA", () => {
  it("happy: creates 3 Toughness tokens and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: tuffnut, hand: [humbleEntranceBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(humbleEntranceBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 3);
    expectFabPlayer(Tuffnut).toHaveAP(1);
    expectFabCard(Tuffnut, humbleEntranceBlue).toBeIn("graveyard");
  });

  it("boundary: the opponent receives none", () => {
    const game = FabTestEngine.start(
      { hero: tuffnut, hand: [humbleEntranceBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(humbleEntranceBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("toughness", 0);
  });
});
