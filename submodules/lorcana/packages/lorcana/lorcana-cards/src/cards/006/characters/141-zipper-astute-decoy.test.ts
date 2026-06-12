import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { zipperAstuteDecoy } from "./141-zipper-astute-decoy";

const inkableCard = createMockCharacter({
  id: "zipper-astute-decoy-inkable-card",
  name: "Inkable Card",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const anotherCharacter = createMockCharacter({
  id: "zipper-astute-decoy-another-character",
  name: "Another Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Zipper - Astute Decoy", () => {
  it("has Ward keyword", () => {
    const wardAbility = (zipperAstuteDecoy.abilities ?? []).find(
      (a) => a.type === "keyword" && a.keyword === "Ward",
    );
    expect(wardAbility).toBeDefined();
  });

  describe("RUN INTERFERENCE - During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn.", () => {
    it("triggers when a card is inked during your turn, granting Resist +1 to another chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [zipperAstuteDecoy, anotherCharacter],
          hand: [inkableCard],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.hasKeyword(anotherCharacter, "Resist")).toBe(false);

      // Ink a card during your turn
      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      // RUN INTERFERENCE triggers
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(zipperAstuteDecoy, {
          resolveOptional: true,
          targets: [anotherCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Another character now has Resist +1
      expect(testEngine.hasKeyword(anotherCharacter, "Resist")).toBe(true);
    });

    it("does NOT trigger during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [zipperAstuteDecoy, anotherCharacter],
          deck: 2,
        },
        {
          hand: [inkableCard],
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      // Opponent inks a card
      expect(testEngine.asPlayerTwo().ink(inkableCard)).toBeSuccessfulCommand();

      // RUN INTERFERENCE should NOT trigger on opponent's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("Resist expires at start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [zipperAstuteDecoy, anotherCharacter],
          hand: [inkableCard],
          deck: [simbaProtectiveCub, simbaProtectiveCub],
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(zipperAstuteDecoy, {
          resolveOptional: true,
          targets: [anotherCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(anotherCharacter, "Resist")).toBe(true);

      // Pass turn to opponent and back
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // Resist should be gone at start of next turn
      expect(testEngine.hasKeyword(anotherCharacter, "Resist")).toBe(false);
    });

    it("can decline the optional and no Resist is granted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [zipperAstuteDecoy, anotherCharacter],
          hand: [inkableCard],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(zipperAstuteDecoy, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(anotherCharacter, "Resist")).toBe(false);
    });
  });
});
