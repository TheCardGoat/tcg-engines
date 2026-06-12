import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { ursulaVoiceStealer } from "./044-ursula-voice-stealer";

const opposingCharacter = createMockCharacter({
  id: "ursula-vs-opposing-character",
  name: "Opposing Character",
  cost: 4,
  strength: 2,
  willpower: 3,
});

const cheapSong = createMockSong({
  id: "ursula-vs-cheap-song",
  name: "Cheap Song",
  cost: 4,
  text: "A cheap song.",
});

const expensiveSong = createMockSong({
  id: "ursula-vs-expensive-song",
  name: "Expensive Song",
  cost: 5,
  text: "An expensive song.",
});

describe("Ursula - Voice Stealer", () => {
  describe("SING FOR ME - When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.", () => {
    it("exerts the chosen opposing ready character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaVoiceStealer],
          inkwell: ursulaVoiceStealer.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(false);

      expect(
        testEngine.asPlayerOne().playCard(ursulaVoiceStealer, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Resolve the triggered ability from the bag
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(ursulaVoiceStealer, {
            targets: [opposingCharacter],
            resolveOptional: false,
          }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
    });

    it("allows playing a song with cost equal to or less than the exerted character's cost for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaVoiceStealer, cheapSong],
          inkwell: ursulaVoiceStealer.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(ursulaVoiceStealer, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      // Resolve: exert opposing character, then optionally play a song
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ursulaVoiceStealer, {
          targets: [opposingCharacter, cheapSong],
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("discard");
    });

    it("does not allow playing a song with cost greater than the exerted character's cost", () => {
      // expensiveSong costs 5, opposingCharacter costs 4 => should not be playable
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaVoiceStealer, expensiveSong],
          inkwell: ursulaVoiceStealer.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(ursulaVoiceStealer, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        // Attempting to play the expensive song should fail or the song should remain in hand
        testEngine.asPlayerOne().resolvePendingByCard(ursulaVoiceStealer, {
          targets: [opposingCharacter, expensiveSong],
          resolveOptional: true,
        });
      }

      // The expensive song should remain in hand since it costs more than the exerted character
      expect(testEngine.asPlayerOne().getCardZone(expensiveSong)).toBe("hand");
    });

    it("can decline to play a song after exerting the opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaVoiceStealer, cheapSong],
          inkwell: ursulaVoiceStealer.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(ursulaVoiceStealer, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(ursulaVoiceStealer, {
            targets: [opposingCharacter],
            resolveOptional: false,
          }),
        ).toBeSuccessfulCommand();
      }

      // Opposing character should still be exerted
      expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
      // Song should remain in hand
      expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("hand");
    });
  });

  it("regression: free song should still be playable after exerting the opposing character", () => {
    // Bug: Ursula's free song was not playing when the opposing character was exerted.
    // The song should be playable after the exert step completes.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ursulaVoiceStealer, cheapSong],
        inkwell: ursulaVoiceStealer.cost,
      },
      {
        play: [opposingCharacter], // cost 4, ready
      },
    );

    // Opposing character must be ready for the exert effect to target it
    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(false);

    expect(
      testEngine.asPlayerOne().playCard(ursulaVoiceStealer, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects.length).toBeGreaterThan(0);

    // Accept and resolve: exert opposing character, then play cheap song for free
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(ursulaVoiceStealer, {
        targets: [opposingCharacter, cheapSong],
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // Character should be exerted and song should have been played (in discard after being cast)
    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("discard");
  });
});
