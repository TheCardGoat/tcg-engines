import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { pulseOfCandleholdYellow } from "./pulse-of-candlehold.ts";

/**
 * Pulse of Candlehold (ELE113) — Earth Lightning Action, cost 0, 3{d},
 * Legendary, go again.
 *
 * Printed: "Put up to 2 target Earth, Lightning and/or Elemental action
 * cards from your graveyard on top of your deck. Banish Pulse of Candlehold.
 * Go again"
 *
 * Pin: the move-card filter is a placeholder hasKeyword that matches no
 * card, so legal GY actions never return (silent no-op). Self-banish and
 * go again still resolve.
 */

describe("Pulse of Candlehold (ELE113) AAA", () => {
  it("boundary: an empty graveyard still banishes Pulse", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [pulseOfCandleholdYellow],
        graveyard: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(pulseOfCandleholdYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Briar, pulseOfCandleholdYellow).toBeBanished();
  });

  it("boundary: a Generic action in graveyard is not returned", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [pulseOfCandleholdYellow],
        graveyard: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(pulseOfCandleholdYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Briar, snatchRed).toBeIn("graveyard");
    expectFabCard(Briar, pulseOfCandleholdYellow).toBeBanished();
  });
});
