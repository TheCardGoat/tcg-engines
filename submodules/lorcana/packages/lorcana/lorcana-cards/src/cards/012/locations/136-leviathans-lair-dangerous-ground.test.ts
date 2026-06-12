import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { leviathansLairDangerousGround } from "./136-leviathans-lair-dangerous-ground";

const opponentCharacter = createMockCharacter({
  id: "leviathans-lair-opp-char-1",
  name: "Opponent Character 1",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const opponentCharacter2 = createMockCharacter({
  id: "leviathans-lair-opp-char-2",
  name: "Opponent Character 2",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const opponentHandCharacter = createMockCharacter({
  id: "leviathans-lair-opp-hand-char",
  name: "Opponent Hand Character",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Leviathan's Lair - Dangerous Ground", () => {
  describe("LOST TO THE DUNES - When this location is banished, each opponent chooses and banishes one of their characters.", () => {
    it("triggers when this location is banished and opponent chooses one of their characters to banish", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [leviathansLairDangerousGround],
        },
        {
          play: [opponentCharacter, opponentCharacter2],
        },
      );

      // Banish the location by setting fatal damage
      expect(
        testEngine
          .asServer()
          .manualSetDamage(leviathansLairDangerousGround, leviathansLairDangerousGround.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(leviathansLairDangerousGround)).toBe("discard");

      // The "When this location is banished" ability should trigger, and opponent
      // gets a pending effect to choose and banish one of their own characters.
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter2)).toBe("play");
    });

    it("does not allow the opponent to banish a character from their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [leviathansLairDangerousGround],
        },
        {
          hand: [opponentHandCharacter],
          play: [opponentCharacter],
        },
      );

      expect(
        testEngine
          .asServer()
          .manualSetDamage(leviathansLairDangerousGround, leviathansLairDangerousGround.willpower),
      ).toBeSuccessfulCommand();

      const pendingEffect = testEngine.asPlayerTwo().getPendingEffects()[0];
      expect(pendingEffect?.selectionContext?.kind).toBe("target-selection");
      if (pendingEffect?.selectionContext?.kind !== "target-selection") {
        throw new Error("Expected Leviathan's Lair to publish a target-selection prompt");
      }

      const handCharacterId = testEngine.findCardInstanceId(
        opponentHandCharacter,
        "hand",
        PLAYER_TWO,
      );
      const playCharacterId = testEngine.findCardInstanceId(opponentCharacter, "play", PLAYER_TWO);
      expect(pendingEffect.selectionContext.cardCandidateIds).toEqual([playCharacterId]);
      expect(pendingEffect.selectionContext.cardCandidateIds).not.toContain(handCharacterId);

      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentHandCharacter] }).success,
      ).toBe(false);

      expect(testEngine.asPlayerTwo().getCardZone(opponentHandCharacter)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("play");
      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(1);
    });

    it("fizzles gracefully when opponent controls no characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [leviathansLairDangerousGround],
        },
        {},
      );

      expect(
        testEngine
          .asServer()
          .manualSetDamage(leviathansLairDangerousGround, leviathansLairDangerousGround.willpower),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(leviathansLairDangerousGround)).toBe("discard");
      // Location banished and effect resolved without crashing — nothing to banish.
    });

    it("auto-drains the bag without prompting the card owner", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [leviathansLairDangerousGround],
        },
        {
          play: [opponentCharacter, opponentCharacter2],
        },
      );

      expect(
        testEngine
          .asServer()
          .manualSetDamage(leviathansLairDangerousGround, leviathansLairDangerousGround.willpower),
      ).toBeSuccessfulCommand();

      // The for-each-opponent + chosenBy: "opponent" bag entry should auto-drain:
      // the card owner never needs to click resolveBag.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // A pending effect is published for the opponent to choose their character.
      expect(testEngine.asPlayerTwo().getPendingEffects().length).toBeGreaterThan(0);

      // Verify the pending effect targets the opponent's characters, not the card owner's.
      const pendingEffect = testEngine.asPlayerTwo().getPendingEffects()[0]!;
      expect(pendingEffect.selectionContext?.kind).toBe("target-selection");
      if (pendingEffect.selectionContext?.kind !== "target-selection") {
        throw new Error("Expected target-selection prompt for Leviathan's Lair pending effect");
      }
      const ownerCharacterId = testEngine.findCardInstanceId(
        leviathansLairDangerousGround,
        "discard",
        PLAYER_ONE,
      );
      if (ownerCharacterId) {
        expect(pendingEffect.selectionContext.cardCandidateIds).not.toContain(ownerCharacterId);
      }

      // Opponent resolves and banishes one of their characters.
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter2)).toBe("play");
    });
  });
});
