import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { pocahontasFollowingTheWind } from "./042-pocahontas-following-the-wind";

const exertedCharacterLore2 = createMockCharacter({
  id: "pocahontas-exerted-ally",
  name: "Exerted Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 2,
});

const exertedOpponentCharacter = createMockCharacter({
  id: "pocahontas-exerted-opponent",
  name: "Exerted Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 3,
});

const readyCharacter = createMockCharacter({
  id: "pocahontas-ready-ally",
  name: "Ready Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 2,
});

describe("Pocahontas - Following the Wind", () => {
  describe("WHAT IS MY PATH? - Whenever this character quests, gain lore equal to another chosen exerted character's {L}.", () => {
    it("gains lore equal to chosen exerted ally's lore value when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: pocahontasFollowingTheWind, isDrying: false },
            { card: exertedCharacterLore2, exerted: true, isDrying: false },
          ],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().quest(pocahontasFollowingTheWind)).toBeSuccessfulCommand();

      // Resolve the triggered ability, targeting the exerted ally
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(pocahontasFollowingTheWind, { targets: [exertedCharacterLore2] }),
      ).toBeSuccessfulCommand();

      // Should gain Pocahontas's own lore (from questing) + exerted ally's lore
      expect(testEngine.getLore(PLAYER_ONE)).toBe(
        pocahontasFollowingTheWind.lore + exertedCharacterLore2.lore,
      );
    });

    it("gains lore equal to chosen exerted opposing character's lore value when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: pocahontasFollowingTheWind, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: exertedOpponentCharacter, exerted: true, isDrying: false }],
          deck: 3,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().quest(pocahontasFollowingTheWind)).toBeSuccessfulCommand();

      // Resolve the triggered ability, targeting the exerted opposing character
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pocahontasFollowingTheWind, {
          targets: [exertedOpponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(
        pocahontasFollowingTheWind.lore + exertedOpponentCharacter.lore,
      );
    });

    // Player bug report: Pocahontas could choose an opponent's exerted
    // character that has Ward. Ward must protect opposing characters from
    // being chosen by opposing effects.
    it("excludes opposing Ward characters from candidate targets", () => {
      const exertedOpponentWardChar = createMockCharacter({
        id: "pocahontas-exerted-opponent-ward",
        name: "Warded Opponent",
        cost: 2,
        strength: 2,
        willpower: 3,
        lore: 3,
        abilities: [
          {
            id: "pocahontas-exerted-opponent-ward-kw",
            type: "keyword",
            keyword: "Ward",
            text: "Ward",
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: pocahontasFollowingTheWind, isDrying: false }],
          deck: 3,
        },
        {
          play: [{ card: exertedOpponentWardChar, exerted: true, isDrying: false }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(pocahontasFollowingTheWind)).toBeSuccessfulCommand();

      // The Warded opposing character must not be a valid target.
      // With no other exerted characters, the trigger has zero valid candidates
      // and should auto-resolve as a no-op rather than letting Pocahontas pick
      // through Ward.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pocahontasFollowingTheWind, {
          targets: [exertedOpponentWardChar],
        }),
      ).not.toBeSuccessfulCommand();

      // Only Pocahontas's own quest lore should have been gained — the bonus
      // from "another chosen exerted character" must not include the warded
      // opponent.
      expect(testEngine.getLore(PLAYER_ONE)).toBe(pocahontasFollowingTheWind.lore);
    });

    it("does not trigger when there are no exerted characters to choose", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: pocahontasFollowingTheWind, isDrying: false },
            { card: readyCharacter, exerted: false, isDrying: false },
          ],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().quest(pocahontasFollowingTheWind)).toBeSuccessfulCommand();

      // No bag to resolve since there are no valid exerted targets (Pocahontas is excluded as self)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Should only gain Pocahontas's own lore from questing
      expect(testEngine.getLore(PLAYER_ONE)).toBe(pocahontasFollowingTheWind.lore);
    });
  });
});
