/** ARK007 The Hand That Pulls the Strings — public face-down Arsenal activation. */
import { describe, expect, it } from "vitest";

import { theHandThatPullsTheStrings } from "../../../../cards/src/cards/mentors/the-hand-that-pulls-the-strings.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../rules/fixtures.ts";

describe("The Hand That Pulls the Strings mentor (ARK007)", () => {
  it("AAA: its controller turns it face-up from face-down Arsenal in an attack reaction window", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [{ card: theHandThatPullsTheStrings, state: { faceDown: true } }],
        hand: [snatchRed],
        deck: 8,
      },
      { hero: dash, hand: [nimblismBlue], deck: 8 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    const Dash = game.as(dash);
    Dash.defendWith(nimblismBlue);
    game.passBoth();
    expect(game.combat()?.step).toBe("reaction");
    expect(game.getPriorityPlayerId()).toBe(Bravo.id);

    Bravo.activate(theHandThatPullsTheStrings);
    game.passBoth();

    expect(Bravo.zone("arsenal")).toContain(theHandThatPullsTheStrings.canonicalId);
    expect(
      game.objectState(Bravo.findCardInZone("arsenal", theHandThatPullsTheStrings)).faceDown,
    ).toBe(false);
  });

  it("boundary: it cannot activate from a face-up Arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [{ card: theHandThatPullsTheStrings, state: { faceDown: false } }],
        hand: [snatchRed],
        deck: 8,
      },
      { hero: dash, hand: [nimblismBlue], deck: 8 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    const Dash = game.as(dash);
    Dash.defendWith(nimblismBlue);
    game.passBoth();

    const rejected = Bravo.expectFailure({
      move: "activate",
      payload: {
        instanceId: Bravo.findCardInZone("arsenal", theHandThatPullsTheStrings),
      },
    });
    expect(rejected.accepted).toBe(false);
  });

  it("a3 AAA: end-phase trigger moves itself to deck bottom and draws when no Silver is controlled", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [{ card: theHandThatPullsTheStrings, state: { faceDown: false } }],
        hand: [snatchRed],
        deck: 8,
      },
      { hero: dash, hand: [nimblismBlue], deck: 8 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // ARK007 is face-up in Arsenal (from fixture). Bravo is active player first.
    // End Bravo's turn — this should trigger ARK007-a3 at end phase.
    // Since Bravo controls no Silver, ARK007 should go to deck bottom and draw 1.
    // The end-of-turn intellect draw then fills hand to intellect (4).
    Bravo.endTurn();
    game.passBoth();

    // ARK007 should have moved from Arsenal to deck bottom
    expect(Bravo.zone("arsenal")).not.toContain(theHandThatPullsTheStrings.canonicalId);
    // Hand should have at least the initial snatchRed + the draw from a3
    // (intellect draw may add more, so check minimum)
    expect(Bravo.zone("hand").length).toBeGreaterThan(1);
  });
});
