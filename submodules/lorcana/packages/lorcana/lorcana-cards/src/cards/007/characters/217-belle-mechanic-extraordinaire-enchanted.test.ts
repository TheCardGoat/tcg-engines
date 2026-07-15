import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { belleMechanicExtraordinaireEnchanted } from "./217-belle-mechanic-extraordinaire-enchanted";
import { belleMechanicExtraordinaire } from "./126-belle-mechanic-extraordinaire";
import { runEnchantedParityCharacterTest } from "../../002/characters/test-helpers";

runEnchantedParityCharacterTest(belleMechanicExtraordinaireEnchanted, belleMechanicExtraordinaire);

const mockItem1 = createMockItem({
  id: "belle-test-item-1",
  name: "Test Item 1",
  cost: 2,
});

const mockItem2 = createMockItem({
  id: "belle-test-item-2",
  name: "Test Item 2",
  cost: 3,
});

const mockItem3 = createMockItem({
  id: "belle-test-item-3",
  name: "Test Item 3",
  cost: 1,
});

const mockCharacter = createMockCharacter({
  id: "belle-test-char",
  name: "Test Character",
  cost: 2,
});

describe("Belle - Mechanic Extraordinaire (Enchanted)", () => {
  describe("REPURPOSE - Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.", () => {
    it("moves 3 items from discard to bottom of deck and gains 3 additional lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: belleMechanicExtraordinaireEnchanted, isDrying: false }],
        discard: [mockItem1, mockItem2, mockItem3],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().quest(belleMechanicExtraordinaireEnchanted),
      ).toBeSuccessfulCommand();

      // Accept the optional triggered ability
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleMechanicExtraordinaireEnchanted),
      ).toBeSuccessfulCommand();

      // Select targets for put-on-bottom
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [mockItem1, mockItem2, mockItem3],
        }),
      ).toBeSuccessfulCommand();

      // Items should be moved to deck
      expect(testEngine.asPlayerOne().getCardZone(mockItem1)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(mockItem2)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(mockItem3)).toBe("deck");

      // 3 lore from quest + 3 lore from REPURPOSE = 6
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(6);
    });

    it("moves 1 item from discard to bottom of deck and gains 1 additional lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: belleMechanicExtraordinaireEnchanted, isDrying: false }],
        discard: [mockItem1],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().quest(belleMechanicExtraordinaireEnchanted),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleMechanicExtraordinaireEnchanted),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [mockItem1],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockItem1)).toBe("deck");

      // 3 lore from quest + 1 lore from REPURPOSE = 4
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(4);
    });

    it("can be declined - no items moved, no bonus lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: belleMechanicExtraordinaireEnchanted, isDrying: false }],
        discard: [mockItem1, mockItem2],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().quest(belleMechanicExtraordinaireEnchanted),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleMechanicExtraordinaireEnchanted, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Items should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(mockItem1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(mockItem2)).toBe("discard");

      // Only 3 lore from quest
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(3);
    });

    it("only targets items in discard, not characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: belleMechanicExtraordinaireEnchanted, isDrying: false }],
        discard: [mockItem1, mockCharacter],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().quest(belleMechanicExtraordinaireEnchanted),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleMechanicExtraordinaireEnchanted),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [mockItem1],
        }),
      ).toBeSuccessfulCommand();

      // Only the item is moved, not the character
      expect(testEngine.asPlayerOne().getCardZone(mockItem1)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(mockCharacter)).toBe("discard");

      // 3 lore from quest + 1 lore from REPURPOSE = 4
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(4);
    });
  });
});
