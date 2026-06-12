import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { ursulaSeaWitchQueenEnchanted } from "./208-ursula-sea-witch-queen-enchanted";
import { ursulaSeaWitchQueen } from "./058-ursula-sea-witch-queen";

const songCard = createMockSong({
  id: "ursula-swq-enchanted-song",
  name: "Test Song",
  cost: 4,
  text: "A Test Song",
});

const targetCharacter = createMockCharacter({
  id: "ursula-swq-enchanted-target",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const otherSinger = createMockCharacter({
  id: "ursula-swq-enchanted-other-singer",
  name: "Other Singer",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Ursula - Sea Witch Queen (Enchanted)", () => {
  it("has the same canonicalId and abilities as the non-enchanted version", () => {
    expect(ursulaSeaWitchQueenEnchanted.canonicalId).toBe(ursulaSeaWitchQueen.canonicalId);
    expect(ursulaSeaWitchQueenEnchanted.abilities).toEqual(ursulaSeaWitchQueen.abilities);
  });

  describe("NOW I AM THE RULER! — Whenever this character quests, exert chosen character.", () => {
    it("exerts a chosen character when Ursula quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: ursulaSeaWitchQueenEnchanted, isDrying: false },
          { card: targetCharacter, isDrying: false },
        ],
        deck: 2,
      });

      expect(testEngine.isExerted(targetCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().quest(ursulaSeaWitchQueenEnchanted)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ursulaSeaWitchQueenEnchanted, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(targetCharacter)).toBe(true);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(ursulaSeaWitchQueenEnchanted.lore);
    });

    it("can exert an opposing character when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ursulaSeaWitchQueenEnchanted, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: targetCharacter, isDrying: false }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(ursulaSeaWitchQueenEnchanted)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ursulaSeaWitchQueenEnchanted, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(targetCharacter)).toBe(true);
    });
  });

  describe("YOU'LL LISTEN TO ME! — Other characters can't exert to sing songs.", () => {
    it("prevents other characters from singing songs while Ursula is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: ursulaSeaWitchQueenEnchanted, isDrying: false },
          { card: otherSinger, isDrying: false },
        ],
        hand: [songCard],
      });

      // Other singer would normally qualify (cost 5 >= song cost 4), but can't sing
      const result = testEngine.asPlayerOne().singSong(songCard, otherSinger);
      expect(result.success).toBe(false);
    });

    it("allows Ursula herself to sing songs", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: ursulaSeaWitchQueenEnchanted, isDrying: false }],
        hand: [songCard],
      });

      // Ursula has cost 7 >= song cost 4 and can sing herself
      const result = testEngine.asPlayerOne().singSong(songCard, ursulaSeaWitchQueenEnchanted);
      expect(result.success).toBe(true);
    });

    it("prevents opposing characters from singing songs while Ursula is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ursulaSeaWitchQueenEnchanted, isDrying: false }],
          deck: 2,
        },
        {
          play: [{ card: otherSinger, isDrying: false }],
          hand: [songCard],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent's character can't sing while Ursula is in play
      const result = testEngine.asPlayerTwo().singSong(songCard, otherSinger);
      expect(result.success).toBe(false);
    });
  });
});
