import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scroogeMcduckMiserlyEbenezer } from "./160-scrooge-mcduck-miserly-ebenezer";

const targetCharacter = createMockCharacter({
  id: "scrooge-target-character",
  name: "Target Character",
  cost: 2,
  strength: 4,
  willpower: 4,
  lore: 1,
});

const inkCard = createMockCharacter({
  id: "scrooge-ink-card",
  name: "Ink Card",
  cost: 1,
  inkable: true,
});

const anotherInkCard = createMockCharacter({
  id: "scrooge-another-ink-card",
  name: "Another Ink Card",
  cost: 2,
  inkable: true,
});

describe("Scrooge McDuck - Miserly Ebenezer", () => {
  it("can be played onto the board", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [scroogeMcduckMiserlyEbenezer],
      inkwell: scroogeMcduckMiserlyEbenezer.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(scroogeMcduckMiserlyEbenezer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(scroogeMcduckMiserlyEbenezer)).toBe("play");
  });

  describe("BAH, HUMBUG - During your turn, whenever a card is put into your inkwell, chosen character gets -1 {S} this turn.", () => {
    it("triggers when a card is put into inkwell and reduces chosen character's strength by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogeMcduckMiserlyEbenezer, targetCharacter],
        hand: [inkCard],
      });

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckMiserlyEbenezer),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
        targetCharacter.strength - 1,
      );
    });

    it("does NOT trigger during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckMiserlyEbenezer],
        },
        {
          hand: [inkCard],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("strength reduction lasts only until end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogeMcduckMiserlyEbenezer, targetCharacter],
        hand: [inkCard],
      });

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckMiserlyEbenezer),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
        targetCharacter.strength - 1,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
        targetCharacter.strength,
      );
    });

    it("can target any character in play including opponent's characters", () => {
      const opponentCharacter = createMockCharacter({
        id: "scrooge-opponent-character",
        name: "Opponent Character",
        cost: 2,
        strength: 3,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckMiserlyEbenezer],
          hand: [inkCard],
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckMiserlyEbenezer),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength - 1,
      );
    });

    it("can target Scrooge himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogeMcduckMiserlyEbenezer],
        hand: [inkCard],
      });

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckMiserlyEbenezer),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [scroogeMcduckMiserlyEbenezer],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(scroogeMcduckMiserlyEbenezer)).toBe(
        scroogeMcduckMiserlyEbenezer.strength - 1,
      );
    });

    it("triggers again on subsequent turns when inking again", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogeMcduckMiserlyEbenezer, targetCharacter],
        hand: [inkCard, anotherInkCard],
      });

      expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckMiserlyEbenezer),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
        targetCharacter.strength - 1,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
        targetCharacter.strength,
      );

      expect(testEngine.asPlayerOne().ink(anotherInkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [secondBagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckMiserlyEbenezer),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
        targetCharacter.strength - 1,
      );
    });
  });
});
