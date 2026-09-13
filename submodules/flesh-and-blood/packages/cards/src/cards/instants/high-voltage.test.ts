import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { highVoltageBlue } from "./high-voltage.ts";

/**
 * High Voltage Blue (ROS078) — Wizard Instant.
 *
 * Printed: Amp 1
 * If you have no cards in hand, draw a card.
 */

describe("Kindle (ROS078) AAA", () => {
  it("happy: Amp 1 raises the next bolt", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [highVoltageBlue, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(highVoltageBlue); // instant; hand now holds only the bolt
    game.passBoth();

    // Amp 1 rides the bolt's arcane damage.
    Kano.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(14); // 20 - (5 + 1)
    expectFabCard(Kano, highVoltageBlue).toBeIn("graveyard");
  });
});
