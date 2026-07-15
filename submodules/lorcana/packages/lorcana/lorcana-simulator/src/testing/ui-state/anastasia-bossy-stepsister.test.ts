import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { anastasiaBossyStepsister } from "@tcg/lorcana-cards/cards/007";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// OH, I HATE THIS!: "Whenever this character is challenged, the challenging player
// chooses and discards a card." Defined at
// lorcana-cards/src/cards/007/characters/113-anastasia-bossy-stepsister.ts with
// `effect.target: "CHALLENGING_PLAYER"` and `effect.type: "discard"`.
//
// UI-level behaviour under test:
//  - After the challenge, a prompt surfaces with `kind === "discard-choice"` (or
//    equivalent), because the challenging player must pick a card from their hand.
//  - The `chooserId` must be the challenging player, not Anastasia's controller.
//  - The candidate list must be the challenging player's hand cards (1 in these
//    fixtures), not a cards-in-play list.

const attacker = createMockCharacter({
  id: "anastasia-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const handCard = createMockCharacter({
  id: "anastasia-hand-card",
  name: "Hand Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Anastasia - Bossy Stepsister | OH, I HATE THIS! | UI prompt", () => {
  it("surfaces a discard prompt on the challenging player after a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: attacker, isDrying: false }],
        hand: [handCard],
        deck: 1,
      },
      {
        play: [{ card: anastasiaBossyStepsister, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(attacker, anastasiaBossyStepsister),
    ).toBeSuccessfulCommand();

    // Resolve the bag effect owned by Anastasia's controller so the selection
    // context becomes active.
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(anastasiaBossyStepsister),
    ).toBeSuccessfulCommand();

    // The challenging player (player_one) is the one who must pick a card.
    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE });

    expect(snapshot).not.toBeNull();
    // A discard choice is still a target-kind selection (kind === "discard-choice"
    // in the engine's ResolutionSelectionKind union).
    expect(snapshot?.kind).toBe("discard-choice");

    // The only legal candidate is the challenging player's sole hand card.
    const handCardId = testEngine.asPlayerOne().getCard(handCard).id;
    expect(snapshot?.cardCandidateIds).toEqual([handCardId]);
    expect(snapshot?.minSelections).toBe(1);
    expect(snapshot?.maxSelections).toBe(1);

    // Regression guard (bug-16): the chooser must be the challenging player
    // (player_one), not Anastasia's controller. If the chooser is wrong, the UI
    // shows the prompt on the wrong side.
    expect(snapshot?.chooserId).toBe(PLAYER_ONE);

    // The trigger source is Anastasia.
    const anastasiaId = testEngine.asPlayerTwo().getCard(anastasiaBossyStepsister).id;
    expect(snapshot?.sourceCardId).toBe(anastasiaId);

    // Overlay gate: "discard" must be in SupportedResolutionTargetEffectType so
    // ResolutionTargetOverlay renders (effectType && slots.length > 0).
    expect(snapshot?.effectType).toBe("discard");
    expect(snapshot?.prompt?.slots.map((slot) => slot.label)).toEqual(["Choose card to discard"]);
    expect(snapshot?.prompt?.candidateEntries.map((e) => e.cardId)).toEqual([handCardId]);
  });

  it("lets the challenging player (when that is player two) see and resolve the prompt themselves", () => {
    // Bug-16 regression: when the challenging player is player_two (i.e. Anastasia's
    // controller is player_one), player_two must be the chooser on the UI side and
    // see their own hand cards as candidates.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: anastasiaBossyStepsister, exerted: true }],
        deck: 1,
      },
      {
        play: [{ card: attacker, isDrying: false }],
        hand: [handCard],
        deck: 0,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(attacker, anastasiaBossyStepsister),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(anastasiaBossyStepsister),
    ).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO });
    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("discard-choice");

    const handCardId = testEngine.asPlayerTwo().getCard(handCard).id;
    expect(snapshot?.cardCandidateIds).toEqual([handCardId]);
    // Bug-16 focus: the chooser must be player_two (the challenger) — if this is
    // wrong, the UI prompts the wrong player to discard.
    expect(snapshot?.chooserId).toBe(PLAYER_TWO);
  });
});
