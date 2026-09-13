import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crankshaftRed } from "../actions/crankshaft.ts";
import { highSpeedImpactRed, highSpeedImpactYellow } from "../actions/high-speed-impact.ts";
import { throttleRed } from "../actions/throttle.ts";
import { heavyIndustryPowerPlant } from "./heavy-industry-power-plant.ts";

/**
 * Heavy Industry Power Plant (AIO004) — Mechanologist Chest d2, Temper.
 *
 * Printed: "Action - {r}, destroy this: Whenever you boost this turn, gain
 * {r}. Go again. Temper"
 */
describe("Heavy Industry Power Plant (AIO004) AAA", () => {
  it("happy: every boost this turn gains {r} and go again refunds the Action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [heavyIndustryPowerPlant],
        hand: [throttleRed, crankshaftRed],
        actionPoints: 1,
        resourcePoints: 6,
        // Boost 8.3.9: go again needs a Mechanologist banish — both deck-top
        // cards are Mechanologist so each boost refunds the spent AP.
        deckTop: [highSpeedImpactYellow, highSpeedImpactRed],
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(heavyIndustryPowerPlant);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, heavyIndustryPowerPlant).toBeIn("graveyard");
    // Go again refunds the Action point spent on the activation.
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabPlayer(Dash).toHaveResourceCount(5); // 6 − 1 activation

    // Each play boosts (banish deck top) — the accepted optional grants go
    // again, funding the next attack.
    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();
    Dash.play(crankshaftRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    // Two boost fires this turn (a one-shot arm would refund only one):
    // 5 − 2 − 2 + 1 + 1 = 3.
    expectFabPlayer(Dash).toHaveResourceCount(3);
  });

  it("boundary: without arming the plant, boosting refunds no resources", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [heavyIndustryPowerPlant],
        hand: [throttleRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    // Boost cost paid in full; the seated plant armed no delayed gain.
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabCard(Dash, heavyIndustryPowerPlant).toBeIn("chest");
  });
});
