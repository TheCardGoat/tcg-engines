import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { highVoltageBlue } from "../instants/high-voltage.ts";
import { blinkBlue } from "../instants/blink.ts";
import { plutonicStarplate } from "./plutonic-starplate.ts";

/**
 * Plutonic Starplate (OMN141) — Lightning Chest d0, Arcane Barrier 1.
 * Printed: "The first time you play a Lightning card during each of your
 * opponent's turns, gain {r}."
 */

describe("Plutonic Starplate (OMN141) AAA", () => {
  it("happy: the first Lightning instant played on the opponent's turn gains {r}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        chest: [plutonicStarplate],
        hand: [highVoltageBlue, blinkBlue],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.toReaction("defender");

    // High Voltage is a Lightning instant — playing it triggers the gain.
    Dash.play(highVoltageBlue);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveResourceCount(2); // 1 kept + 1 gained

    // Second Lightning card the same turn: the limit has been consumed.
    game.helpers.passPriorityTo(Dash);
    Dash.play(blinkBlue);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveResourceCount(2); // no second gain
  });

  it("boundary: on your own turn playing Lightning gains nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [plutonicStarplate],
        hand: [highVoltageBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(highVoltageBlue);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveResourceCount(1); // the free instant gained nothing
  });
});
