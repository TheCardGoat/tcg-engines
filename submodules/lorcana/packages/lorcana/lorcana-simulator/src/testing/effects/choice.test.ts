import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { makeThePotion } from "@tcg/lorcana-cards/cards/004";
import {
  hadesLookingForADeal,
  donaldDuckGhostHunter,
  mickeyMouseDetective,
} from "@tcg/lorcana-cards/cards/010";

const damagedCharacter = createMockCharacter({
  id: "choice-damaged-char",
  name: "Damaged Character",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const testItem = createMockItem({
  id: "choice-test-item",
  name: "Test Item",
  cost: 2,
});

describe("Choice - Make the Potion - Choose one: Banish chosen item OR Deal 2 damage to chosen damaged character.", () => {
  it("should resolve the first option (banish item) when chosen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makeThePotion],
        inkwell: makeThePotion.cost,
      },
      {
        play: [testItem],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(makeThePotion, {
        choiceIndex: 0,
        targets: [testItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(testItem)).toBe("discard");
  });

  it("should resolve the second option (deal damage) when chosen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makeThePotion],
        inkwell: makeThePotion.cost,
      },
      {
        play: [{ card: damagedCharacter, damage: 1 }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(makeThePotion, {
        choiceIndex: 1,
        targets: [damagedCharacter],
      }),
    ).toBeSuccessfulCommand();

    // 1 existing + 2 new = 3 damage
    expect(testEngine.asPlayerTwo().getDamage(damagedCharacter)).toBe(3);
  });

  it("should not allow choosing the damage option on an undamaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makeThePotion],
        inkwell: makeThePotion.cost,
      },
      {
        play: [damagedCharacter], // NOT damaged
      },
    );

    const result = testEngine.asPlayerOne().playCard(makeThePotion, {
      choiceIndex: 1,
      targets: [damagedCharacter],
    }) as CommandFailure;

    expect(result.success).toBe(false);
  });

  it("should only resolve the chosen option, not both", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [makeThePotion],
        inkwell: makeThePotion.cost,
      },
      {
        play: [testItem, { card: damagedCharacter, damage: 1 }],
      },
    );

    // Choose option 1 (banish item)
    expect(
      testEngine.asPlayerOne().playCard(makeThePotion, {
        choiceIndex: 0,
        targets: [testItem],
      }),
    ).toBeSuccessfulCommand();

    // Item should be banished
    expect(testEngine.asPlayerTwo().getCardZone(testItem)).toBe("discard");
    // Damaged character should NOT have extra damage
    expect(testEngine.asPlayerTwo().getDamage(damagedCharacter)).toBe(1);
  });
});

describe("Choice - Hades - Looking for a Deal", () => {
  it("surfaces the opponent branch choice after the chosen target is locked in", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 10,
      },
      {
        play: [donaldDuckGhostHunter, mickeyMouseDetective],
        deck: 5,
      },
    );
    const chosenId = testEngine.findCardInstanceId(donaldDuckGhostHunter, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADeal, {
        resolveOptional: true,
        targets: [chosenId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getPendingEffects()).toEqual([
      expect.objectContaining({
        type: "choice-selection",
        selectionContext: expect.objectContaining({
          kind: "choice-selection",
          currentSelection: expect.objectContaining({
            targets: [chosenId],
          }),
          submitField: "choiceIndex",
          options: [
            expect.objectContaining({
              index: 0,
              label: "put that character on the bottom of their deck",
              legal: true,
            }),
            expect.objectContaining({
              index: 1,
              label: "you draw 2 cards",
              legal: true,
            }),
          ],
        }),
      }),
    ]);
  });

  it("lets the opposing player put the chosen target on the bottom of their deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 10,
      },
      {
        play: [donaldDuckGhostHunter, mickeyMouseDetective],
        deck: 5,
      },
    );
    const chosenId = testEngine.findCardInstanceId(donaldDuckGhostHunter, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADeal, {
        resolveOptional: true,
        targets: [chosenId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

    expect(testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[chosenId]?.zoneKey).toBe(
      "deck:player_two",
    );
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });

  it("lets the opposing player refuse the deal so Hades's controller draws 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 10,
      },
      {
        play: [donaldDuckGhostHunter, mickeyMouseDetective],
        deck: 5,
      },
    );
    const chosenId = testEngine.findCardInstanceId(mickeyMouseDetective, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADeal, {
        resolveOptional: true,
        targets: [chosenId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();

    expect(testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[chosenId]?.zoneKey).toBe(
      "play:player_two",
    );
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("lets the controller decline the optional when the opponent has no characters in play (THE-881)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 10,
      },
      {
        play: [],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADeal, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });
});
