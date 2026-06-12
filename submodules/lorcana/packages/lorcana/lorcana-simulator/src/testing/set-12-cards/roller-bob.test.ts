import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rollerBobSidsToy } from "@tcg/lorcana-cards/cards/012";

const discardChar1 = createMockCharacter({
  id: "roller-bob-discard-1",
  name: "Discard Char 1",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const discardChar2 = createMockCharacter({
  id: "roller-bob-discard-2",
  name: "Discard Char 2",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("TIME TO MOVE - Roller Bob, Sid's Toy - When you play this character, you may put 2 character cards from your discard on the bottom of your deck to give this character Rush this turn.", () => {
  it("should auto-skip when fewer than 2 character cards in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rollerBobSidsToy],
        inkwell: rollerBobSidsToy.cost,
        discard: [discardChar1], // only 1 char in discard
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(rollerBobSidsToy)).toBeSuccessfulCommand();

    // Should auto-skip (no bag effect to resolve)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("should allow declining when 2+ character cards are in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rollerBobSidsToy],
        inkwell: rollerBobSidsToy.cost,
        discard: [discardChar1, discardChar2],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(rollerBobSidsToy)).toBeSuccessfulCommand();

    // Bag should have the optional trigger
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    // Player can decline the optional
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: false,
        }),
    ).toBeSuccessfulCommand();

    // Roller Bob should NOT have Rush (optional declined)
    expect(testEngine.asPlayerOne().getCardZone(rollerBobSidsToy)).toBe("play");
    // No Rush — bag should be empty
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("should grant Rush when accepted and 2 chars are put on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rollerBobSidsToy],
        inkwell: rollerBobSidsToy.cost,
        discard: [discardChar1, discardChar2],
        deck: 2,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne().playCard(rollerBobSidsToy)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    // Accept and target both discard chars
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
          targets: [discardChar1, discardChar2],
        }),
    ).toBeSuccessfulCommand();

    // Both chars should no longer be in discard (moved to bottom of deck)
    expect(testEngine.asPlayerOne().getCardZone(discardChar1)).not.toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(discardChar2)).not.toBe("discard");
  });
});
