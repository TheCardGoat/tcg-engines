import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { ladyTremaineBitterlyJealous } from "./115-lady-tremaine-bitterly-jealous";

const damagedTarget = createMockCharacter({
  id: "lady-tremaine-bj-damaged-target",
  name: "Damaged Target",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const opponentHandCard = createMockCharacter({
  id: "lady-tremaine-bj-opp-hand-card",
  name: "Opponent Hand Card",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Lady Tremaine - Bitterly Jealous", () => {
  describe("THAT'S QUITE ENOUGH — {E} Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.", () => {
    it("returns a damaged character to their player's hand and the opponent discards a card at random", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ladyTremaineBitterlyJealous, exerted: false }],
          deck: 2,
        },
        {
          play: [{ card: damagedTarget, damage: 1 }],
          hand: [opponentHandCard],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(ladyTremaineBitterlyJealous, {
          ability: "THAT'S QUITE ENOUGH",
          targets: [damagedTarget],
        }),
      ).toBeSuccessfulCommand();

      // The damaged character is returned to its owner's hand
      expect(testEngine.asPlayerTwo().getCardZone(damagedTarget)).toBe("hand");

      // The opponent discards a card at random (the only card left is opponentHandCard which is now in discard,
      // or damagedTarget may have been moved back to hand + one discard, resulting in hand=1, discard=1)
      // After return-to-hand: opponent hand = [damagedTarget, opponentHandCard] = 2 cards
      // After discard 1 at random: discard = 1, hand = 1
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
    });

    it("can target a damaged character on Lady Tremaine controller's own side", () => {
      const ownDamagedCharacter = createMockCharacter({
        id: "lady-tremaine-bj-own-damaged",
        name: "Own Damaged Character",
        cost: 2,
        strength: 2,
        willpower: 4,
        lore: 1,
      });

      const opponentCard = createMockCharacter({
        id: "lady-tremaine-bj-own-damaged-opp-hand",
        name: "Opp Hand Card",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: ladyTremaineBitterlyJealous, exerted: false },
            { card: ownDamagedCharacter, damage: 1 },
          ],
          deck: 2,
        },
        {
          hand: [opponentCard],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(ladyTremaineBitterlyJealous, {
          ability: "THAT'S QUITE ENOUGH",
          targets: [ownDamagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Own damaged character returned to player one's hand
      expect(testEngine.asPlayerOne().getCardZone(ownDamagedCharacter)).toBe("hand");

      // Opponent discards 1 at random
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
    });
  });
});
