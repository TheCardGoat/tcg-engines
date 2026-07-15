import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ursulaSeaWitch } from "./059-ursula-sea-witch";

const opponentCharacter = createMockCharacter({
  id: "opp-char",
  name: "Opponent Character",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Ursula - Sea Witch", () => {
  describe("YOU'RE TOO LATE — Whenever this character quests, chosen opposing character can't ready at the start of their next turn.", () => {
    it("applies cant-ready restriction to chosen opposing character when Ursula quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ursulaSeaWitch],
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      // Quest with Ursula — triggers YOU'RE TOO LATE
      expect(testEngine.asPlayerOne().quest(ursulaSeaWitch)).toBeSuccessfulCommand();

      // Resolve the triggered ability targeting the opponent's character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ursulaSeaWitch, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // Pass player one's turn to advance to player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // At start of player two's turn, the exerted character should NOT be readied
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("can target a ready opposing character (but it has no immediate effect)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ursulaSeaWitch],
          deck: 3,
        },
        {
          play: [opponentCharacter], // ready
          deck: 3,
        },
      );

      // Quest with Ursula
      expect(testEngine.asPlayerOne().quest(ursulaSeaWitch)).toBeSuccessfulCommand();

      // Resolve targeting the READY character — should still be valid
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ursulaSeaWitch, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // The character is still ready (You're Too Late doesn't exert)
      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    });

    it("gains lore from questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ursulaSeaWitch],
          deck: 3,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().quest(ursulaSeaWitch)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ursulaSeaWitch, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(ursulaSeaWitch.lore);
    });
  });
});
