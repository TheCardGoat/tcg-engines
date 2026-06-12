import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseArtfulRogue } from "../../001/characters/088-mickey-mouse-artful-rogue";
import { minnieMouseSweetheartPrincessIconic } from "./241-minnie-mouse-sweetheart-princess-iconic";

const strongExertedCharacter = createMockCharacter({
  id: "minnie-iconic-strong",
  name: "Strong Character",
  cost: 5,
  strength: 5,
  willpower: 5,
});

const weakExertedCharacter = createMockCharacter({
  id: "minnie-iconic-weak",
  name: "Weak Character",
  cost: 3,
  strength: 4,
  willpower: 3,
});

const nonMickeyCharacter = createMockCharacter({
  id: "minnie-iconic-non-mickey",
  name: "Non Mickey Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Minnie Mouse - Sweetheart Princess (Iconic)", () => {
  describe("ROYAL FAVOR - Your characters named Mickey Mouse gain Support.", () => {
    it("gives Support to Mickey Mouse characters you control", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [minnieMouseSweetheartPrincessIconic, mickeyMouseArtfulRogue],
      });

      expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseArtfulRogue, "Support")).toBe(true);
    });

    it("does not give Support to non-Mickey Mouse characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [minnieMouseSweetheartPrincessIconic, nonMickeyCharacter],
      });

      expect(testEngine.asPlayerOne().hasKeyword(nonMickeyCharacter, "Support")).toBe(false);
    });

    it("does not give Support to opponent's Mickey Mouse characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseSweetheartPrincessIconic],
        },
        {
          play: [mickeyMouseArtfulRogue],
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(mickeyMouseArtfulRogue, "Support")).toBe(false);
    });
  });

  describe("BYE BYE, NOW - Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.", () => {
    it("triggers an optional bag effect when Minnie quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMouseSweetheartPrincessIconic, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: strongExertedCharacter, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().quest(minnieMouseSweetheartPrincessIconic),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("banishes chosen exerted character with 5 or more strength when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMouseSweetheartPrincessIconic, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: strongExertedCharacter, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().quest(minnieMouseSweetheartPrincessIconic),
      ).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseSweetheartPrincessIconic, {
          resolveOptional: true,
          targets: [strongExertedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(strongExertedCharacter)).toBe("discard");
    });

    it("does not banish when the optional trigger is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMouseSweetheartPrincessIconic, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: strongExertedCharacter, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().quest(minnieMouseSweetheartPrincessIconic),
      ).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseSweetheartPrincessIconic, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(strongExertedCharacter)).toBe("play");
    });

    it("does not banish a character with less than 5 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMouseSweetheartPrincessIconic, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: weakExertedCharacter, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().quest(minnieMouseSweetheartPrincessIconic),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        const bagEffect = bagEffects[0]!;
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(minnieMouseSweetheartPrincessIconic, {
            resolveOptional: true,
            targets: [weakExertedCharacter],
          }),
        ).not.toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().getCardZone(weakExertedCharacter)).toBe("play");
    });

    it("should banish only one character", () => {
      const secondStrongCharacter = createMockCharacter({
        id: "minnie-iconic-strong-2",
        name: "Strong Character 2",
        cost: 5,
        strength: 6,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMouseSweetheartPrincessIconic, isDrying: false }],
          deck: 1,
        },
        {
          play: [
            { card: strongExertedCharacter, exerted: true },
            { card: secondStrongCharacter, exerted: true },
          ],
        },
      );

      expect(
        testEngine.asPlayerOne().quest(minnieMouseSweetheartPrincessIconic),
      ).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(minnieMouseSweetheartPrincessIconic, {
          resolveOptional: true,
          targets: [strongExertedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(strongExertedCharacter)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(secondStrongCharacter)).toBe("play");
    });
  });
});
