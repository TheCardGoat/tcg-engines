import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { abuIllusoryPachyderm } from "./050-abu-illusory-pachyderm";

const opponentCharacter = createMockCharacter({
  id: "opp-char",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 3,
});

describe("Abu - Illusory Pachyderm", () => {
  it("should have Vanish ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [abuIllusoryPachyderm],
    });

    const cardUnderTest = testEngine.getCardModel(abuIllusoryPachyderm);
    expect(cardUnderTest.hasVanish).toBe(true);
  });

  describe("GRASPING TRUNK - Whenever this character quests, gain lore equal to the {L} of chosen opposing character.", () => {
    it("gains lore equal to the lore value of chosen opposing character when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: abuIllusoryPachyderm, isDrying: false }],
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      // Quest with Abu
      expect(testEngine.asPlayerOne().quest(abuIllusoryPachyderm)).toBeSuccessfulCommand();

      // Resolve the triggered ability targeting the opponent's character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(abuIllusoryPachyderm, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // Should gain Abu's own lore (from questing) + opponent character's lore (from ability)
      expect(testEngine.getLore(PLAYER_ONE)).toBe(
        abuIllusoryPachyderm.lore + opponentCharacter.lore,
      );
    });
  });
});
