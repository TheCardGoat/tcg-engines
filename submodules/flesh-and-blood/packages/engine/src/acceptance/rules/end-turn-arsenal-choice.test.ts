import { describe, expect, it } from "vitest";

import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "../../testing/index.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

describe("CR 4.4.3b end-turn arsenal choice AAA", () => {
  it("happy: presents the turn-player's hand and puts their chosen card face-down into arsenal", () => {
    // Arrange: the turn-player has cards in hand and room in arsenal.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, nimblismBlue], deck: 8 },
      { hero: dash, hand: [], deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act: both players pass on an empty stack to end the Action Phase, then choose the card.
    Bravo.pass();
    Dash.pass();
    expect(Bravo.expectDecision("entity-target")).toMatchObject({
      min: 0,
      max: 1,
      continuation: { kind: "turn-arsenal" },
    });
    Bravo.target(snatchRed);

    // Assert: the chosen card is hidden in arsenal before the next turn begins.
    expectFabCard(Bravo, snatchRed).toBeIn("arsenal").toBeFaceDown();
    expectFabPlayer(Bravo).toHaveHandCount(4);
    expectFabPlayer(Dash).toHaveHandCount(4);
    expectFabPlayer(Dash).toBeActive();
  });

  it("boundary: lets the turn-player decline and keeps every card out of arsenal", () => {
    // Arrange: arsenaling is legal, but optional.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, nimblismBlue], deck: 8 },
      { hero: dash, hand: [], deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act: submit an empty up-to-one selection, exactly representing "do not arsenal."
    Bravo.pass();
    Dash.pass();
    Bravo.target();

    // Assert: the hand draws to intellect, arsenal remains empty, and the turn advances.
    expect(Bravo.zone("arsenal")).toEqual([]);
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveHandCount(4);
    expectFabPlayer(Dash).toHaveHandCount(4);
    expectFabPlayer(Dash).toBeActive();
  });

  it("interaction: skips the choice when arsenal has no empty zone", () => {
    // Arrange: the normal one-card arsenal is already occupied.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue], arsenal: [snatchRed], deck: 8 },
      { hero: dash, hand: [], deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act: end the turn with no legal Arsenal destination.
    Bravo.endTurn();

    // Assert: no choice is manufactured and the existing Arsenal card is preserved.
    expect(game.getState().decision).toBeNull();
    expectFabCard(Bravo, snatchRed).toBeIn("arsenal");
    expectFabPlayer(Dash).toBeActive();
  });
});
