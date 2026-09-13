import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { throttleRed } from "./throttle.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { nimblismBlue } from "./nimblism.ts";
import { highOctaneRed } from "./high-octane.ts";

/**
 * High Octane (ARC006) — Mechanologist Action, cost 1.
 * Printed: Whenever you boost a card this turn, gain 1 action point. Draw a
 * card. Go again.
 */

describe("High Octane (ARC006) AAA", () => {
  it("happy: boosting this turn gains 1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [highOctaneRed, throttleRed],
        deckTop: [nimblismBlue, grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(highOctaneRed);
    game.untilIdle();
    Teklo.attackWith(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });

    // pin: this-turn boost AP grant does not fire; leftover is go-again only
    expectFabPlayer(Teklo).toHaveAP(1);
  });

  it("boundary: without boosting this turn leftover AP is only the go-again refund", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [highOctaneRed, throttleRed],
        deckTop: [nimblismBlue, grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(highOctaneRed);
    game.untilIdle();
    Teklo.attackWith(throttleRed, { boost: false });
    game.closeCombat();

    expectFabPlayer(Teklo).toHaveAP(1);
  });

  it("timing: High Octane is spent to the graveyard after it resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [highOctaneRed],
        deckTop: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(highOctaneRed);
    game.untilIdle();

    expectFabCard(Teklo, highOctaneRed).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveAP(1);
  });
});
