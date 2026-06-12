import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { basilDisguisedDetective } from "@tcg/lorcana-cards/cards/006";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// TWISTS AND TURNS: "During your turn, whenever a card is put into your inkwell,
// you may pay 1 {I} to have chosen opponent choose and discard a card." Defined
// at lorcana-cards/src/cards/006/characters/091-basil-disguised-detective.ts.
//
// The discard effect carries `chosenBy: "opponent"` and `target: "OPPONENT"`.
// The card text says "have chosen opponent choose and discard" — the discard
// choice is made by the opponent, not by Basil's controller. On the UI this
// means that after Basil's controller accepts the optional and pays the ink,
// the resulting target-selection prompt must:
//   - Have `chooserId === PLAYER_TWO` (the opponent).
//   - Expose the opponent's own hand cards as candidates.
//   - Require exactly one selection.
//
// These assertions lock in the engine contract behind the UI; a regression in
// chooser attribution is caught here without needing a browser.

const inkCard = createMockCharacter({
  id: "basil-ui-ink-card",
  name: "Ink Card",
  cost: 1,
  inkable: true,
});

const opponentHandA = createMockCharacter({
  id: "basil-ui-opp-hand-a",
  name: "Opponent Card A",
  cost: 1,
});

const opponentHandB = createMockCharacter({
  id: "basil-ui-opp-hand-b",
  name: "Opponent Card B",
  cost: 2,
});

const ownHandCard = createMockCharacter({
  id: "basil-ui-own-hand",
  name: "Controller's Own Card",
  cost: 1,
});

describe("Basil - Disguised Detective | TWISTS AND TURNS | UI prompt", () => {
  it("after accepting the optional, the discard prompt belongs to the OPPONENT", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [basilDisguisedDetective],
        hand: [inkCard, ownHandCard],
      },
      {
        hand: [opponentHandA, opponentHandB],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Basil's controller accepts the optional and pays the ink cost.
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(basilDisguisedDetective, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO });

    expect(snapshot).not.toBeNull();
    // `discard` with `chosen: true` is classified as `discard-choice` rather than
    // the more generic `target-selection` by the selection-context builder.
    expect(snapshot?.kind).toBe("discard-choice");

    // BUG FOCUS — the card DSL carries `chosenBy: "opponent"`. The selection
    // context must therefore assign the opponent as the chooser so the
    // simulator UI opens the prompt on the opponent's side. Without this, the
    // opponent never gets asked to pick a card and Basil's controller ends up
    // picking which opponent card to discard — which contradicts the card
    // text ("have chosen opponent choose and discard a card").
    expect(snapshot?.chooserId).toBe(PLAYER_TWO);

    const basilId = testEngine.asPlayerTwo().getCard(basilDisguisedDetective).id;
    expect(snapshot?.sourceCardId).toBe(basilId);

    // Exactly one opponent card is discarded per trigger.
    expect(snapshot?.minSelections).toBe(1);
    expect(snapshot?.maxSelections).toBe(1);

    // Candidates are the opponent's hand cards — NOT Basil's controller's hand,
    // NOT any card in play.
    const oppCardAId = testEngine.asPlayerTwo().getCard(opponentHandA).id;
    const oppCardBId = testEngine.asPlayerTwo().getCard(opponentHandB).id;
    const controllerCardId = testEngine.asPlayerOne().getCard(ownHandCard).id;
    const candidateIds = snapshot?.cardCandidateIds ?? [];

    expect(candidateIds).toContain(oppCardAId);
    expect(candidateIds).toContain(oppCardBId);
    expect(candidateIds).not.toContain(controllerCardId);
    expect(candidateIds).not.toContain(basilId);

    // Overlay gate: `effectType === "discard"` wires the ResolutionTargetOverlay
    // (which requires effectType && slots.length > 0). Without this, the chooser
    // sees an empty board with nothing to click.
    expect(snapshot?.effectType).toBe("discard");
    expect(snapshot?.prompt?.slots.map((slot) => slot.label)).toEqual(["Choose card to discard"]);
    expect(snapshot?.prompt?.candidateEntries.map((e) => e.cardId).sort()).toEqual(
      [oppCardAId, oppCardBId].sort(),
    );
  });

  it("exposes the opponent's hand as the candidate pool even from player_one's view", () => {
    // Cross-view guard: whichever player reads the board, the candidate list
    // and chooser should agree. A bug that projects the candidates onto the
    // wrong player's hand would show here.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [basilDisguisedDetective],
        hand: [inkCard, ownHandCard],
      },
      {
        hand: [opponentHandA, opponentHandB],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(basilDisguisedDetective, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    const oppCardAId = testEngine.asPlayerTwo().getCard(opponentHandA).id;
    const oppCardBId = testEngine.asPlayerTwo().getCard(opponentHandB).id;

    const fromP1 = snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE });
    const fromP2 = snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO });

    for (const snapshot of [fromP1, fromP2]) {
      expect(snapshot?.cardCandidateIds).toContain(oppCardAId);
      expect(snapshot?.cardCandidateIds).toContain(oppCardBId);
      // Both views must agree on the chooser — the opponent (player_two).
      expect(snapshot?.chooserId).toBe(PLAYER_TWO);
    }
  });

  it("does not open the discard prompt when the optional is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [basilDisguisedDetective],
        hand: [inkCard],
      },
      {
        hand: [opponentHandA],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(basilDisguisedDetective, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // No further prompt should surface on either side.
    expect(snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE })).toBeNull();
    expect(snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO })).toBeNull();
    expect(testEngine.asPlayerTwo().getCardZone(opponentHandA)).toBe("hand");
  });
});
