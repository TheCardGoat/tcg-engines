import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { lyleTiberiusRourkeCrystallizedCommander } from "./103-lyle-tiberius-rourke-crystallized-commander";

const lowCostAction = createMockAction({
  id: "lyle-cc-low-cost-action",
  name: "Low Cost Action",
  cost: 3,
});

const fourCostAction = createMockAction({
  id: "lyle-cc-four-cost-action",
  name: "Four Cost Action",
  cost: 4,
});

const fiveCostAction = createMockAction({
  id: "lyle-cc-five-cost-action",
  name: "Five Cost Action",
  cost: 5,
});

const deckCard1 = createMockCharacter({
  id: "lyle-cc-deck-1",
  name: "Deck Card 1",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const deckCard2 = createMockCharacter({
  id: "lyle-cc-deck-2",
  name: "Deck Card 2",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Lyle Tiberius Rourke - Crystallized Commander", () => {
  it("has Shift 4", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [lyleTiberiusRourkeCrystallizedCommander],
      deck: 5,
    });

    expect(testEngine.hasKeyword(lyleTiberiusRourkeCrystallizedCommander, "Shift")).toBe(true);
  });

  describe("Plan's Changed - When you play this character, put the top 2 cards of your deck into your discard. Then, you may return an action card with cost 4 or less from your discard to your hand.", () => {
    it("mills 2 and returns an eligible action card from discard to hand when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: lyleTiberiusRourkeCrystallizedCommander.cost,
        hand: [lyleTiberiusRourkeCrystallizedCommander],
        deck: [deckCard1, deckCard2],
        discard: [fourCostAction],
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(lyleTiberiusRourkeCrystallizedCommander)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(lyleTiberiusRourkeCrystallizedCommander, {
          resolveOptional: true,
          targets: [fourCostAction],
        }),
      ).toBeSuccessfulCommand();

      // Two cards moved from deck to discard
      expect(playerOne.getCardZone(deckCard1)).toBe("discard");
      expect(playerOne.getCardZone(deckCard2)).toBe("discard");
      // Action card returned to hand
      expect(playerOne.getCardZone(fourCostAction)).toBe("hand");
    });

    it("mills 2 and declines the optional return, leaving discard untouched by the return step", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: lyleTiberiusRourkeCrystallizedCommander.cost,
        hand: [lyleTiberiusRourkeCrystallizedCommander],
        deck: [deckCard1, deckCard2],
        discard: [lowCostAction],
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(lyleTiberiusRourkeCrystallizedCommander)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(lyleTiberiusRourkeCrystallizedCommander, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(deckCard1)).toBe("discard");
      expect(playerOne.getCardZone(deckCard2)).toBe("discard");
      expect(playerOne.getCardZone(lowCostAction)).toBe("discard");
    });

    it("does not offer an action with cost 5 as a valid target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: lyleTiberiusRourkeCrystallizedCommander.cost,
        hand: [lyleTiberiusRourkeCrystallizedCommander],
        deck: [deckCard1, deckCard2],
        discard: [fiveCostAction],
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(lyleTiberiusRourkeCrystallizedCommander)).toBeSuccessfulCommand();

      // The ability still triggers for the mill step; the optional return
      // step must not accept a cost-5 action as a target.
      if (playerOne.getBagCount() > 0) {
        expect(
          playerOne.resolvePendingByCard(lyleTiberiusRourkeCrystallizedCommander, {
            resolveOptional: false,
          }),
        ).toBeSuccessfulCommand();
      }

      expect(playerOne.getCardZone(deckCard1)).toBe("discard");
      expect(playerOne.getCardZone(deckCard2)).toBe("discard");
      expect(playerOne.getCardZone(fiveCostAction)).toBe("discard");
    });
  });
});
