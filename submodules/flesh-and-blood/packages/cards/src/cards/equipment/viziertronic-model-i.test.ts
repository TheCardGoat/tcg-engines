import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { throttleRed, throttleYellow } from "../actions/throttle.ts";
import { viziertronicModelI } from "./viziertronic-model-i.ts";

/**
 * Viziertronic Model i (1HP187) — Mechanologist Equipment - Head.
 *
 * Printed: Action - Destroy this: Whenever you boost this turn, draw a card
 * then put a card from your hand on top of your deck. Go again.
 * Arcane Barrier 2.
 */

describe("Viziertronic Model i (1HP187) AAA", () => {
  it("happy: after activating, each boost draws a card then stacks one back on top", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [viziertronicModelI],
        hand: [throttleRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(viziertronicModelI);
    game.untilIdle();

    // Destroy-self as the cost; go again refunds the action point.
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabCard(Dash, viziertronicModelI).toBeIn("graveyard");

    Dash.play(throttleRed, { boost: true });
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(snatchRed);
    game.untilIdle();

    // Boost drew a card (hand: Snatch + drawn), then Snatch went on top of
    // the deck and the drawn card stayed in hand. zone("deck") is
    // bottom-first, so the top card is the last entry.
    expectFabPlayer(Dash).toHaveHandCount(1);
    expect(Dash.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
  });

  it("boundary: boosting without having activated the Model draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [viziertronicModelI],
        hand: [throttleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(throttleRed, { boost: true });
    game.untilIdle();

    // Throttle left the hand and the boost banished the deck top; no draw.
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, viziertronicModelI).toBeIn("head");
  });

  it("timing: the trigger expires at end of turn - a later boost draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [viziertronicModelI],
        hand: [throttleRed, throttleYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(viziertronicModelI);
    game.untilIdle();
    Dash.endTurn();
    game.untilIdle();
    game.as(bravo).endTurn();
    game.untilIdle();

    // Next turn: the latched trigger is gone. Throttle still needs its {r},
    // pitched from the other Throttle copy. Dash drew to 4 intellect at the
    // end of turn 1 (2 Throttles + 2 fillers); pitch + play leaves 2.
    Dash.play(throttleRed, { pitch: throttleYellow, boost: true });
    game.untilIdle();
    expectFabPlayer(Dash).toHaveHandCount(2);
  });
});
