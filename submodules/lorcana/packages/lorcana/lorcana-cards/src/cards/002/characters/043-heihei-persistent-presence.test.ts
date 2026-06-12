import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { heiheiPersistentPresence } from "./043-heihei-persistent-presence";
import { theHornedKingTriumphantGhoul } from "../../010/characters/049-the-horned-king-triumphant-ghoul";

const opponentTarget = createMockCharacter({
  id: "heihei-test-opponent-target",
  name: "Weak Defender",
  cost: 1,
  strength: 2,
  willpower: 3,
});

describe("HeiHei - Persistent Presence", () => {
  describe("HE'S BACK!", () => {
    it("returns to hand when banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: heiheiPersistentPresence, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: opponentTarget, isDrying: false, exerted: true }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(heiheiPersistentPresence, opponentTarget),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(heiheiPersistentPresence)).toBe("hand");
    });

    it("updates the discard-cards-left metric so Horned King's GRAND MACHINATIONS applies on the same turn", () => {
      // HeiHei (strength 2, willpower 1) challenges a 2-strength defender — both take lethal damage.
      // HeiHei is banished → enters discard → "HE'S BACK!" fires → return-to-hand from discard.
      // The return-to-hand-effect must call recordDiscardExitThisTurn so that Horned King's
      // GRAND MACHINATIONS ("+2 lore if 1+ cards left discard this turn") applies immediately.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: heiheiPersistentPresence, isDrying: false },
            { card: theHornedKingTriumphantGhoul, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: opponentTarget, isDrying: false, exerted: true }],
          deck: 5,
        },
      );

      const hornedKingBaseLore = theHornedKingTriumphantGhoul.lore ?? 0;
      expect(testEngine.asPlayerOne().getCardLore(theHornedKingTriumphantGhoul)).toBe(
        hornedKingBaseLore,
      );

      expect(
        testEngine.asPlayerOne().challenge(heiheiPersistentPresence, opponentTarget),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(heiheiPersistentPresence)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardLore(theHornedKingTriumphantGhoul)).toBe(
        hornedKingBaseLore + 2,
      );
    });
  });
});
