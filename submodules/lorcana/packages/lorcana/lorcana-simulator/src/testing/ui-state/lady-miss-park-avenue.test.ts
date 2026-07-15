import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ladyMissParkAvenue } from "@tcg/lorcana-cards/cards/007";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

const discardCharOne = createMockCharacter({
  id: "lady-mpa-ui-discard-1",
  name: "Discard Character One",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const discardCharTwo = createMockCharacter({
  id: "lady-mpa-ui-discard-2",
  name: "Discard Character Two",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Lady - Miss Park Avenue | UI prompt", () => {
  it("keeps the return-to-hand prompt open for the second discard character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ladyMissParkAvenue],
      inkwell: ladyMissParkAvenue.cost,
      discard: [discardCharOne, discardCharTwo],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(ladyMissParkAvenue)).toBeSuccessfulCommand();

    const initial = snapshotPendingPrompt(testEngine, { playerId: PLAYER_ONE });
    expect(initial?.effectType).toBe("return-to-hand");
    expect(initial?.minSelections).toBe(0);
    expect(initial?.maxSelections).toBe(2);
    expect(initial?.prompt?.slots).toHaveLength(2);

    const firstCardId = testEngine.asPlayerOne().getCard(discardCharOne).id;
    const secondCardId = testEngine.asPlayerOne().getCard(discardCharTwo).id;

    const afterFirstSelection = snapshotPendingPrompt(testEngine, {
      playerId: PLAYER_ONE,
      selectedTargets: [firstCardId],
    });

    expect(afterFirstSelection?.prompt?.activeSlotIndex).toBe(1);
    expect(afterFirstSelection?.message).toBe(
      "Choose the character to return to its player's hand.",
    );
    expect(afterFirstSelection?.prompt?.candidateEntries.map((entry) => entry.cardId)).toEqual([
      secondCardId,
    ]);
  });
});
