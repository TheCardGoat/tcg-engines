import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scroogeMcduckCavernProspector } from "./018-scrooge-mcduck-cavern-prospector";
import { gastonFrightfulBully } from "./002-gaston-frightful-bully";
import { scroogesCountingHouseEbenezersOffice } from "../../011/locations/134-scrooges-counting-house-ebenezers-office";

const deckCard = createMockCharacter({
  id: "scrooge-test-deck-card",
  name: "Deck Card",
  cost: 1,
});

const nonBoostCharacter = createMockCharacter({
  id: "scrooge-test-non-boost",
  name: "Non Boost Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Scrooge McDuck - Cavern Prospector", () => {
  describe("Shift 4", () => {
    it("has Shift 4 keyword ability", () => {
      const shiftAbility = scroogeMcduckCavernProspector.abilities?.find(
        (a) => a.type === "keyword" && a.keyword === "Shift",
      );
      expect(shiftAbility).toBeDefined();
      expect(
        shiftAbility?.type === "keyword" && "cost" in shiftAbility ? shiftAbility.cost : undefined,
      ).toEqual({ ink: 4 });
    });

    it("has shiftTarget for Scrooge McDuck", () => {
      const shiftAbility = scroogeMcduckCavernProspector.abilities?.find(
        (a) => a.type === "keyword" && a.keyword === "Shift",
      );
      expect(shiftAbility).toBeDefined();
      expect(
        shiftAbility?.type === "keyword" && "shiftTarget" in shiftAbility
          ? shiftAbility.shiftTarget
          : undefined,
      ).toBe("Scrooge McDuck");
    });
  });

  describe("SPECULATION - Whenever you play a character or location with Boost, you may put the top card of your deck facedown under them", () => {
    it("triggers when playing a character with Boost keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: gastonFrightfulBully.cost,
        hand: [gastonFrightfulBully],
        play: [scroogeMcduckCavernProspector],
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(gastonFrightfulBully)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("puts top card of deck under the played character with Boost when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: gastonFrightfulBully.cost,
        hand: [gastonFrightfulBully],
        play: [scroogeMcduckCavernProspector],
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(gastonFrightfulBully)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckCavernProspector),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(gastonFrightfulBully)).toHaveLength(1);
    });

    it("triggers when playing a location with Boost and puts the top card under it when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: scroogesCountingHouseEbenezersOffice.cost,
        hand: [scroogesCountingHouseEbenezersOffice],
        play: [scroogeMcduckCavernProspector],
        deck: [deckCard],
      });

      expect(
        testEngine.asPlayerOne().playCard(scroogesCountingHouseEbenezersOffice),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckCavernProspector),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(scroogesCountingHouseEbenezersOffice)).toHaveLength(1);
    });

    it("does not put card under when optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: gastonFrightfulBully.cost,
        hand: [gastonFrightfulBully],
        play: [scroogeMcduckCavernProspector],
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(gastonFrightfulBully)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(scroogeMcduckCavernProspector, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(gastonFrightfulBully)).toHaveLength(0);
    });

    it("does not trigger when playing a character without Boost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: nonBoostCharacter.cost,
        hand: [nonBoostCharacter],
        play: [scroogeMcduckCavernProspector],
        deck: [deckCard],
      });

      expect(testEngine.asPlayerOne().playCard(nonBoostCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not trigger when opponent plays a character with Boost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckCavernProspector],
          deck: [deckCard],
        },
        {
          inkwell: gastonFrightfulBully.cost,
          hand: [gastonFrightfulBully],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(gastonFrightfulBully)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});
