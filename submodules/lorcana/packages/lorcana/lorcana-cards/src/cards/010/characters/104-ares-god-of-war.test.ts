import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aresGodOfWar } from "./104-ares-god-of-war";
import { megaraSecretKeeper } from "./086-megara-secret-keeper";
import { blessedBagpipes } from "../items/101-blessed-bagpipes";

const topDeckCard = createMockCharacter({
  id: "ares-test-top-deck",
  name: "Top Deck Card",
  cost: 1,
});

const anotherCharacter = createMockCharacter({
  id: "ares-test-another-char",
  name: "Another Character",
  cost: 2,
  lore: 1,
});

describe("Ares - God of War", () => {
  describe("Reckless", () => {
    it("should have Reckless keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aresGodOfWar],
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: aresGodOfWar,
        keyword: "Reckless",
      });
    });
  });

  describe("CALL TO BATTLE - Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.", () => {
    it("should trigger when a card is put under a character and ready chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aresGodOfWar, megaraSecretKeeper, anotherCharacter],
        hand: [blessedBagpipes],
        inkwell: blessedBagpipes.cost,
        deck: [topDeckCard],
      });

      // Exert another character
      const anotherCharId = testEngine.findCardInstanceId(anotherCharacter, "play", "p1");
      testEngine.asServer().manualExertCard(anotherCharId);
      expect(testEngine.asPlayerOne().isExerted(anotherCharacter)).toBe(true);

      // Play Blessed Bagpipes which triggers MCDUCK HEIRLOOM (puts card under Boost character)
      expect(testEngine.asPlayerOne().playCard(blessedBagpipes)).toBeSuccessfulCommand();

      // Resolve Bagpipes optional trigger - put top deck card under Megara (Boost character)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [megaraSecretKeeper],
        }),
      ).toBeSuccessfulCommand();

      // CALL TO BATTLE should now trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept optional and target the exerted character to ready it
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [anotherCharId],
        }),
      ).toBeSuccessfulCommand();

      // Character should be readied
      expect(testEngine.asPlayerOne().isExerted(anotherCharacter)).toBe(false);

      // Character should have cant-quest restriction for the rest of the turn
      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: anotherCharacter,
        restriction: "cant-quest",
      });
    });

    it("should be optional - can decline the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aresGodOfWar, megaraSecretKeeper, anotherCharacter],
        hand: [blessedBagpipes],
        inkwell: blessedBagpipes.cost,
        deck: [topDeckCard],
      });

      // Exert another character
      const anotherCharId = testEngine.findCardInstanceId(anotherCharacter, "play", "p1");
      testEngine.asServer().manualExertCard(anotherCharId);

      // Play Blessed Bagpipes
      expect(testEngine.asPlayerOne().playCard(blessedBagpipes)).toBeSuccessfulCommand();

      // Resolve Bagpipes trigger
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [megaraSecretKeeper],
        }),
      ).toBeSuccessfulCommand();

      // Decline CALL TO BATTLE
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Character should still be exerted
      expect(testEngine.asPlayerOne().isExerted(anotherCharacter)).toBe(true);
      // No restriction applied
      expect(testEngine.hasRestriction(anotherCharacter, "cant-quest")).toBe(false);
    });
  });
});
