import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theLeviathanGuardianOfAtlantis } from "@tcg/lorcana-cards/cards/012";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// The Leviathan - Guardian of Atlantis: "IT'S A MACHINE! When you play this
// character, if 2 or more cards were put into your discard this turn, you may
// banish any number of chosen opposing characters with total cost 10 or less."
//
// Card definition: count: { upTo: 10 }, totalCostBudget: 10
//
// UI-level behaviour under test:
//  - The optional + banish merge into a single target-selection prompt
//    (originatesFromOptional: true) when the opponent has characters in play.
//  - maxSelections is capped by actual candidate count (e.g. 2 opponents → 2).
//  - The prompt builder generates one slot per actual candidate, NOT 10.
//  - minSelections === 0 so the first guidance action is "Skip" (not "Confirm").
//  - canDeclineSelection === true so a decline/skip action is available.

const discardFodderA = createMockCharacter({
  id: "leviathan-ui-fodder-a",
  name: "Fodder A",
  cost: 1,
});

const discardFodderB = createMockCharacter({
  id: "leviathan-ui-fodder-b",
  name: "Fodder B",
  cost: 1,
});

const opposingCheap = createMockCharacter({
  id: "leviathan-ui-cheap",
  name: "Cheap Opponent",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const opposingPricey = createMockCharacter({
  id: "leviathan-ui-pricey",
  name: "Pricey Opponent",
  cost: 5,
  strength: 3,
  willpower: 4,
});

describe("The Leviathan - Guardian of Atlantis | IT'S A MACHINE! | UI prompt", () => {
  it("surfaces a merged target-selection prompt (not optional-selection) when the opponent has characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theLeviathanGuardianOfAtlantis],
        inkwell: theLeviathanGuardianOfAtlantis.cost,
        deck: [discardFodderA, discardFodderB],
      },
      {
        play: [opposingCheap, opposingPricey],
        deck: 5,
      },
    );

    const fodderAId = testEngine.findCardInstanceId(discardFodderA, "deck", PLAYER_ONE);
    const fodderBId = testEngine.findCardInstanceId(discardFodderB, "deck", PLAYER_ONE);
    expect(
      testEngine.asServer().manualMoveCard(fodderAId, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualMoveCard(fodderBId, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCard(theLeviathanGuardianOfAtlantis),
    ).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE });

    // Optional + target-selection should merge into a single target-selection prompt.
    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.effectType).toBe("banish");

    // There are 2 opponent characters, so maxSelections is capped at 2, not 10.
    // minSelections is 0 because it's an optional effect.
    expect(snapshot?.minSelections).toBe(0);
    expect(snapshot?.maxSelections).toBe(2);

    // The prompt should have 2 slots (one per actual candidate), not 10.
    expect(snapshot?.prompt?.slots).toHaveLength(2);

    // Both opponent characters must appear as candidates.
    const cheapId = testEngine.asPlayerTwo().getCard(opposingCheap).id;
    const priceyId = testEngine.asPlayerTwo().getCard(opposingPricey).id;
    expect(snapshot?.cardCandidateIds).toContain(cheapId as unknown as string);
    expect(snapshot?.cardCandidateIds).toContain(priceyId as unknown as string);
    expect(snapshot?.prompt?.candidateEntries.map((e) => e.cardId)).toContain(
      cheapId as unknown as string,
    );
    expect(snapshot?.prompt?.candidateEntries.map((e) => e.cardId)).toContain(
      priceyId as unknown as string,
    );
  });

  it("excludes the controller's own characters from the candidate list", () => {
    const controllerChar = createMockCharacter({
      id: "leviathan-ui-controller-char",
      name: "Controller Character",
      cost: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theLeviathanGuardianOfAtlantis],
        inkwell: theLeviathanGuardianOfAtlantis.cost,
        deck: [discardFodderA, discardFodderB],
        play: [{ card: controllerChar, isDrying: false }],
      },
      {
        play: [opposingCheap],
        deck: 5,
      },
    );

    const fodderAId = testEngine.findCardInstanceId(discardFodderA, "deck", PLAYER_ONE);
    const fodderBId = testEngine.findCardInstanceId(discardFodderB, "deck", PLAYER_ONE);
    expect(
      testEngine.asServer().manualMoveCard(fodderAId, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualMoveCard(fodderBId, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCard(theLeviathanGuardianOfAtlantis),
    ).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE });

    expect(snapshot?.kind).toBe("target-selection");

    const controllerCharId = testEngine.asPlayerOne().getCard(controllerChar).id;
    const cheapId = testEngine.asPlayerTwo().getCard(opposingCheap).id;

    // Only the opponent's character should be in candidates.
    expect(snapshot?.cardCandidateIds).toContain(cheapId as unknown as string);
    expect(snapshot?.cardCandidateIds).not.toContain(controllerCharId as unknown as string);
    expect(snapshot?.prompt?.candidateEntries.map((e) => e.cardId)).not.toContain(
      controllerCharId as unknown as string,
    );
  });

  it("no prompt from player two's view (opponent waits, not prompted)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theLeviathanGuardianOfAtlantis],
        inkwell: theLeviathanGuardianOfAtlantis.cost,
        deck: [discardFodderA, discardFodderB],
      },
      {
        play: [opposingCheap],
        deck: 5,
      },
    );

    const fodderAId = testEngine.findCardInstanceId(discardFodderA, "deck", PLAYER_ONE);
    const fodderBId = testEngine.findCardInstanceId(discardFodderB, "deck", PLAYER_ONE);
    expect(
      testEngine.asServer().manualMoveCard(fodderAId, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualMoveCard(fodderBId, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCard(theLeviathanGuardianOfAtlantis),
    ).toBeSuccessfulCommand();

    // Player two is not the chooser and must not receive any prompt.
    const p2Snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO });
    expect(p2Snapshot?.chooserId).not.toBe(PLAYER_TWO);
  });
});
