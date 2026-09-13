import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { oathOfOakRed } from "./oath-of-oak.ts";

/**
 * Oath of Oak (Red) (PEN219) — Earth Action, cost 0.
 * Printed: "Create 3 Embodiment of Earth tokens."
 */

describe("Oath of Oak family AAA", () => {
  it("happy: creates 3 Embodiment of Earth tokens", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [oathOfOakRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(oathOfOakRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 3);
    expectFabCard(Briar, oathOfOakRed).toBeIn("graveyard");
  });

  it("boundary: the opponent receives none", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [oathOfOakRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(oathOfOakRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("embodiment-of-earth", 0);
    expectFabPlayer(Briar).toHaveAP(0);
  });
});
