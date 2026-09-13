/**
 * CR 8.5.48 Transcend — now a first-class FabEffect (type:"transcend").
 *
 * ENG026 Homage to Ancestors has a conditional transcend: "If you've played
 * another blue card this turn, transcend." The transcend effect fires during
 * resolution when the condition is met. Twelve-Petal K-Ya (MST048) observes
 * the transcend event for its optional +1{r} reward.
 */
import { describe, expect, it } from "vitest";
import { twelvePetalKYa } from "../../../../../../cards/src/cards/equipment/twelve-petal-k-ya.ts";
import { homageToAncestorsBlue } from "../../../../../../cards/src/cards/instants/homage-to-ancestors.ts";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue } from "../../../fixtures.ts";

describe("trigger: transcend", () => {
  it("AAA: transcend effect fires when condition is met (ENG026 + MST048)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [twelvePetalKYa],
        hand: [homageToAncestorsBlue, nimblismBlue],
        deck: 6,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    const Bravo = game.as(bravo);

    // Before playing: transcend has not occurred this turn.
    expect(game.getState().players[Bravo.id]?.history.turn.transcended).toBeFalsy();

    // Play a blue card first to satisfy ENG026's "played another blue card this turn" condition.
    Bravo.play(nimblismBlue);
    game.passBoth();

    // Act — play Homage to Ancestors (ENG026). Its a2 resolution effect is
    // {type:"transcend"} (CR 8.5.48), gated by the blue-card condition (now met).
    Bravo.play(homageToAncestorsBlue);
    game.passBoth();

    // Assert — the transcend event was committed (CR 8.5.48a: player is
    // considered to have transcended).
    expect(game.getState().players[Bravo.id]?.history.turn.transcended).toBe(true);
  });
});
