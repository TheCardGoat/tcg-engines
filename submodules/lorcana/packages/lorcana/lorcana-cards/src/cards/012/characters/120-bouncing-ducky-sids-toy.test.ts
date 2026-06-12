import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { bouncingDuckySidsToy } from "./120-bouncing-ducky-sids-toy";

const toyInDiscardOne = createMockCharacter({
  id: "ducky-toy-discard-1",
  name: "Toy One",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const toyInDiscardTwo = createMockCharacter({
  id: "ducky-toy-discard-2",
  name: "Toy Two",
  cost: 3,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Hero", "Toy"],
});

const nonToyInDiscard = createMockCharacter({
  id: "ducky-non-toy-discard",
  name: "Non-Toy",
  cost: 4,
  strength: 4,
  willpower: 4,
  classifications: ["Storyborn", "Ally"],
});

describe("Bouncing Ducky - Sid's Toy", () => {
  describe("REJECTED TOYS - For each Toy character card in your discard, you pay 1 {I} less to play this character.", () => {
    it("reduces the play cost by the number of Toy character cards in your discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bouncingDuckySidsToy],
        discard: [toyInDiscardOne, toyInDiscardTwo, nonToyInDiscard],
        inkwell: bouncingDuckySidsToy.cost - 2,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCard(bouncingDuckySidsToy).playCost).toBe(
        bouncingDuckySidsToy.cost - 2,
      );
      expect(testEngine.asPlayerOne().playCard(bouncingDuckySidsToy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(bouncingDuckySidsToy)).toBe("play");
    });

    it("does not reduce cost when there are no Toy characters in the discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bouncingDuckySidsToy],
        discard: [nonToyInDiscard],
        inkwell: bouncingDuckySidsToy.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCard(bouncingDuckySidsToy).playCost).toBe(
        bouncingDuckySidsToy.cost,
      );
    });
  });

  describe("REPURPOSED - When you play this character, put all Toy character cards from your discard on the bottom of your deck in any order.", () => {
    it("moves every Toy character card from the discard onto the bottom of the deck when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bouncingDuckySidsToy],
        discard: [toyInDiscardOne, toyInDiscardTwo, nonToyInDiscard],
        inkwell: bouncingDuckySidsToy.cost,
        deck: 5,
      });

      const nonToyId = testEngine.findCardInstanceId(nonToyInDiscard, "discard", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(bouncingDuckySidsToy)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(bouncingDuckySidsToy),
      ).toBeSuccessfulCommand();
      expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);

      expect(testEngine.asPlayerOne().getCardZone(toyInDiscardOne)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(toyInDiscardTwo)).toBe("deck");
      // Non-Toy characters remain in discard
      expect(testEngine.asPlayerOne().getCardZone(nonToyInDiscard)).toBe("discard");
      expect(testEngine.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual([nonToyId]);
    });

    it("does nothing when there are no Toy characters in the discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bouncingDuckySidsToy],
        discard: [nonToyInDiscard],
        inkwell: bouncingDuckySidsToy.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(bouncingDuckySidsToy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(bouncingDuckySidsToy)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(nonToyInDiscard)).toBe("discard");
    });
  });
});
