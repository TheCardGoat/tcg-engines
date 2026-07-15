import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { scroogeMcduckReformedEbenezer } from "./152-scrooge-mcduck-reformed-ebenezer";

const allyOne = createMockCharacter({
  id: "scrooge-reformed-ally-one",
  name: "Ally One",
  cost: 2,
});

const allyTwo = createMockCharacter({
  id: "scrooge-reformed-ally-two",
  name: "Ally Two",
  cost: 2,
});

describe("Scrooge McDuck - Reformed Ebenezer", () => {
  it("has Shift 4 keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [scroogeMcduckReformedEbenezer],
    });

    const cardUnderTest = testEngine.getCardModel(scroogeMcduckReformedEbenezer);
    expect(cardUnderTest.hasShift()).toBe(true);
    expect(cardUnderTest.shiftInkCost).toBe(4);
  });

  describe("SPREADING JOY", () => {
    it("puts a card facedown under each other character and grants them Ward when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckReformedEbenezer],
        play: [allyOne, allyTwo],
        inkwell: scroogeMcduckReformedEbenezer.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckReformedEbenezer),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scroogeMcduckReformedEbenezer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(allyOne, "Ward")).toBe(true);
      expect(testEngine.hasKeyword(allyTwo, "Ward")).toBe(true);
      expect(testEngine.hasKeyword(scroogeMcduckReformedEbenezer, "Ward")).toBe(false);

      expect(testEngine.asPlayerOne().getCardsUnderCount(allyOne)).toBe(1);
      expect(testEngine.asPlayerOne().getCardsUnderCount(allyTwo)).toBe(1);
    });

    it("grants no Ward and puts no cards under when declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scroogeMcduckReformedEbenezer],
        play: [allyOne, allyTwo],
        inkwell: scroogeMcduckReformedEbenezer.cost,
        deck: 5,
      });

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckReformedEbenezer),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scroogeMcduckReformedEbenezer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(allyOne, "Ward")).toBe(false);
      expect(testEngine.hasKeyword(allyTwo, "Ward")).toBe(false);
      expect(testEngine.asPlayerOne().getCardsUnderCount(allyOne)).toBe(0);
      expect(testEngine.asPlayerOne().getCardsUnderCount(allyTwo)).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(deckBefore);
    });

    it("does not grant Ward to opponent characters", () => {
      const opponentAlly = createMockCharacter({
        id: "scrooge-reformed-opponent-ally",
        name: "Opponent Ally",
        cost: 2,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [scroogeMcduckReformedEbenezer],
          play: [allyOne],
          inkwell: scroogeMcduckReformedEbenezer.cost,
          deck: 5,
        },
        {
          play: [opponentAlly],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(scroogeMcduckReformedEbenezer),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scroogeMcduckReformedEbenezer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(opponentAlly, "Ward")).toBe(false);
      expect(testEngine.hasKeyword(allyOne, "Ward")).toBe(true);
    });
  });
});
