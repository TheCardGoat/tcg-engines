import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { liloBestExplorerEver } from "./174-lilo-best-explorer-ever";

const alienCharacter = createMockCharacter({
  id: "lilo-test-alien",
  name: "Alien Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Alien"],
});

const nonAlienCharacter = createMockCharacter({
  id: "lilo-test-non-alien",
  name: "Non-Alien Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const otherCharacter = createMockCharacter({
  id: "lilo-test-other",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally"],
});

describe("Lilo - Best Explorer Ever", () => {
  describe("COME ON, PEOPLE, LET'S MOVE - When you play this character, your other characters gain Challenger +2 this turn.", () => {
    it("grants Challenger +2 to other characters when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [liloBestExplorerEver],
          play: [otherCharacter, alienCharacter],
          inkwell: liloBestExplorerEver.cost,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Challenger")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(alienCharacter, "Challenger")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(liloBestExplorerEver)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(otherCharacter, "Challenger")).toBe(2);
      expect(testEngine.asPlayerOne().hasKeyword(alienCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(alienCharacter, "Challenger")).toBe(2);
    });

    it("Challenger +2 effect expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [liloBestExplorerEver],
          play: [otherCharacter],
          inkwell: liloBestExplorerEver.cost,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().playCard(liloBestExplorerEver)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Challenger")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Challenger")).toBe(false);
    });

    it("Lilo does not gain Challenger from her own ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [liloBestExplorerEver],
          play: [],
          inkwell: liloBestExplorerEver.cost,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().playCard(liloBestExplorerEver)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(liloBestExplorerEver, "Challenger")).toBe(false);
    });
  });

  describe("GO GET 'EM - Whenever this character quests, chosen Alien character gains Challenger +2 and 'This character can challenge ready characters' this turn.", () => {
    it("grants Challenger +2 and can-challenge-ready to chosen Alien character when Lilo quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: liloBestExplorerEver, isDrying: false }, alienCharacter, nonAlienCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(alienCharacter, "Challenger")).toBe(false);
      expect(testEngine.hasGrantedAbility(alienCharacter, "can-challenge-ready")).toBe(false);

      expect(testEngine.asPlayerOne().quest(liloBestExplorerEver)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(liloBestExplorerEver, { targets: [alienCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(alienCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(alienCharacter, "Challenger")).toBe(2);
      expect(testEngine.hasGrantedAbility(alienCharacter, "can-challenge-ready")).toBe(true);
    });

    it("only Alien characters can be chosen as targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: liloBestExplorerEver, isDrying: false }, alienCharacter, nonAlienCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(liloBestExplorerEver)).toBeSuccessfulCommand();

      const result = testEngine
        .asPlayerOne()
        .resolvePendingByCard(liloBestExplorerEver, { targets: [nonAlienCharacter] });
      expect(result.success).toBe(false);
    });

    it("effects expire at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: liloBestExplorerEver, isDrying: false }, alienCharacter],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().quest(liloBestExplorerEver)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(liloBestExplorerEver, { targets: [alienCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(alienCharacter, "Challenger")).toBe(true);
      expect(testEngine.hasGrantedAbility(alienCharacter, "can-challenge-ready")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(alienCharacter, "Challenger")).toBe(false);
      expect(testEngine.hasGrantedAbility(alienCharacter, "can-challenge-ready")).toBe(false);
    });

    it("triggers each time Lilo quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: liloBestExplorerEver, isDrying: false }, alienCharacter],
          deck: 5,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().quest(liloBestExplorerEver)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(liloBestExplorerEver, { targets: [alienCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getKeywordValue(alienCharacter, "Challenger")).toBe(2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(alienCharacter, "Challenger")).toBe(false);

      expect(testEngine.asPlayerOne().quest(liloBestExplorerEver)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(liloBestExplorerEver, { targets: [alienCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(alienCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(alienCharacter, "Challenger")).toBe(2);
    });
  });
});
