import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { judyHoppsOnTheCase } from "./137-judy-hopps-on-the-case";
import { genieInvestigativeMind } from "./146-genie-investigative-mind";

const mockItem = createMockItem({
  id: "judy-otc-mock-item",
  name: "Mock Item",
  cost: 2,
});

describe("Judy Hopps - On the Case", () => {
  describe("HIDDEN CLUES - When you play this character, if you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.", () => {
    it("does not trigger when no other Detective is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOnTheCase],
          inkwell: judyHoppsOnTheCase.cost,
          play: [mockItem],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().playCard(judyHoppsOnTheCase)).toBeSuccessfulCommand();
      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers and creates an optional bag when another Detective is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOnTheCase],
          inkwell: judyHoppsOnTheCase.cost,
          play: [genieInvestigativeMind, mockItem],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().playCard(judyHoppsOnTheCase)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("puts chosen item into its player's inkwell facedown and exerted when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOnTheCase],
          inkwell: judyHoppsOnTheCase.cost,
          play: [genieInvestigativeMind, mockItem],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().playCard(judyHoppsOnTheCase)).toBeSuccessfulCommand();

      const itemId = testEngine.findCardInstanceId(mockItem, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [itemId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("inkwell");
      expect(testEngine.asServer().getCard(itemId)).toEqual(
        expect.objectContaining({ exerted: true, zone: "inkwell" }),
      );
      expect(
        testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[itemId]?.publicFaceState,
      ).toBe("faceDown");
    });

    it("can decline the optional effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOnTheCase],
          inkwell: judyHoppsOnTheCase.cost,
          play: [genieInvestigativeMind, mockItem],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().playCard(judyHoppsOnTheCase)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("play");
    });

    it("can target an opponent's item and puts it into the opponent's inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [judyHoppsOnTheCase],
          inkwell: judyHoppsOnTheCase.cost,
          play: [genieInvestigativeMind],
          deck: 1,
        },
        {
          play: [mockItem],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(judyHoppsOnTheCase)).toBeSuccessfulCommand();

      const itemId = testEngine.findCardInstanceId(mockItem, "play", PLAYER_TWO);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [itemId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(mockItem)).toBe("inkwell");
    });
  });
});
