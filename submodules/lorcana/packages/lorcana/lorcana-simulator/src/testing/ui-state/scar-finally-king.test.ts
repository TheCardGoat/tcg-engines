import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { scarFinallyKing } from "@tcg/lorcana-cards/cards/009";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// STICK WITH ME: "At the end of your turn, if this character is exerted, you may
// draw cards equal to the {S} of chosen Ally character of yours. If you do,
// choose and discard 2 cards and banish that character."
//
// Player report (2026-04-24): "I had scar - finally king exerted at the end of
// my turn but I couldn't skip his ability and had no ally on the board."
//
// When Scar is exerted at end-of-turn with no Ally in play, the optional trigger
// still fires (per rules 8.6 — optional abilities trigger even if they would
// have no effect). The UI prompt must let the controller decline. This test
// locks in the selection-context contract: the surfaced prompt must be
// declinable (either an `optional-selection` prompt, or a target-selection with
// `canDeclineSelection: true`).

describe("Scar - Finally King | STICK WITH ME | UI prompt", () => {
  it("surfaces a declinable prompt when Scar is exerted with no ally in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: scarFinallyKing, exerted: true }],
        deck: 10,
      },
      { deck: 5 },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const snapshot = snapshotPendingPrompt(testEngine);

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("optional-selection");
  });

  it("declines gracefully when there is no ally and resolves to no-op", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: scarFinallyKing, exerted: true }],
        deck: 10,
      },
      { deck: 5 },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(scarFinallyKing, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(10);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });
});
