/**
 * ARA029 Inertia — end-phase destroy + bottom-deck hand and arsenal.
 *
 * Printed: At the beginning of your end phase, destroy Inertia, then put all
 * cards from your hand and arsenal on the bottom of your deck.
 *
 * Card fix: trigger gains actor:"controller" ("your end phase").
 *
 * Public coverage proves both the token destruction and the full hand/arsenal
 * move through the current event/reducer boundary.
 */
import { describe, expect, it } from "vitest";

import { inertia } from "../../../../cards/src/cards/tokens/inertia.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, sigilOfSolaceRed, snatchRed } from "../../rules/fixtures.ts";

describe("Inertia token (ARA029)", () => {
  it("trigger fires: token destroyed at controller's end phase", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [inertia], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(inertia.canonicalId);
  });

  it("puts every hand and arsenal card on the bottom of its controller's deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [inertia],
        hand: [nimblismBlue, snatchRed],
        arsenal: [sigilOfSolaceRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("hand")).toHaveLength(2);
    expect(Bravo.zone("arsenal")).toHaveLength(1);
    expect(Bravo.zone("deck")).toHaveLength(6);

    Bravo.endTurn();
    game.passBoth();

    expect(Bravo.zone("arena")).not.toContain(inertia.canonicalId);
    // End-turn cleanup draws a fresh four-card hand after Inertia moves the
    // original cards. Verify identities and the resulting deck size rather
    // than observing the pre-draw intermediate state through a private hook.
    expect(Bravo.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(snatchRed.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(sigilOfSolaceRed.canonicalId);
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("deck")).toContain(sigilOfSolaceRed.canonicalId);
    expect(Bravo.zone("deck")).toHaveLength(5);
  });
});
