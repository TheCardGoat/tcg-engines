import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { ursulaSeaWitchQueen } from "./058-ursula-sea-witch-queen";
import { beOurGuest } from "../../001/actions/025-be-our-guest";

const otherCharacter = createMockCharacter({
  id: "ursula-swq-other-char",
  name: "Other Character",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const songCard = createMockSong({
  id: "ursula-swq-song",
  name: "Test Song",
  cost: 3,
  text: "Draw a card.",
});

describe("Ursula - Sea Witch Queen", () => {
  describe("NOW I AM THE RULER! — Whenever this character quests, exert chosen character.", () => {
    it("triggers a bag effect when Ursula quests, allowing the controller to exert a chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: ursulaSeaWitchQueen, isDrying: false }, otherCharacter],
      });

      expect(testEngine.asPlayerOne().isExerted(otherCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().quest(ursulaSeaWitchQueen)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ursulaSeaWitchQueen, {
          targets: [otherCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(otherCharacter)).toBe(true);
    });

    it("can exert an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ursulaSeaWitchQueen, isDrying: false }],
        },
        {
          play: [otherCharacter],
        },
      );

      expect(testEngine.asPlayerOne().quest(ursulaSeaWitchQueen)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects).toHaveLength(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ursulaSeaWitchQueen, {
          targets: [otherCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(otherCharacter)).toBe(true);
    });
  });

  describe("YOU'LL LISTEN TO ME! — Other characters can't exert to sing songs.", () => {
    it("prevents other characters from singing songs while Ursula is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ursulaSeaWitchQueen, otherCharacter],
        hand: [beOurGuest],
      });

      // otherCharacter has cost 3, beOurGuest costs 2 — normally valid singer
      const result = testEngine.asPlayerOne().singSong(beOurGuest, otherCharacter);
      expect(result.success).toBe(false);
    });

    it("Ursula herself is still able to sing (only OTHER characters are prevented)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: ursulaSeaWitchQueen, isDrying: false }],
        hand: [songCard],
      });

      // Ursula costs 7, song costs 3 — she can sing it; restriction only applies to others
      const result = testEngine.asPlayerOne().singSong(songCard, ursulaSeaWitchQueen);
      expect(result.success).toBe(true);
    });
  });
});
