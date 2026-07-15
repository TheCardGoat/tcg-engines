import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, CANONICAL_PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { merlinCleverClairvoyant } from "./067-merlin-clever-clairvoyant";
import { heiheiBoatSnack } from "../../001/characters/007-heihei-boat-snack";

describe("Merlin - Clever Clairvoyant", () => {
  describe("PRESTIDIGITONIUM", () => {
    it("when questing and the named card matches the top card, puts it into the inkwell facedown and exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [merlinCleverClairvoyant],
        deck: [heiheiBoatSnack],
      });

      expect(testEngine.asPlayerOne().quest(merlinCleverClairvoyant)).toBeSuccessfulCommand();

      // Triggered ability creates a bag effect requiring a named card
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ namedCard: "HeiHei" }),
      ).toBeSuccessfulCommand();

      // The revealed card matched the named card, so it goes into inkwell
      expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("inkwell");
      expect(testEngine.isCardFaceDown(heiheiBoatSnack, "inkwell", CANONICAL_PLAYER_ONE)).toBe(
        true,
      );
      expect(testEngine.isExerted(heiheiBoatSnack)).toBe(true);
    });

    it("when questing and the named card does NOT match the top card, puts it back on top of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [merlinCleverClairvoyant],
        deck: [heiheiBoatSnack],
      });

      expect(testEngine.asPlayerOne().quest(merlinCleverClairvoyant)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ namedCard: "Jafar" }),
      ).toBeSuccessfulCommand();

      // The revealed card did not match, so it stays on top of the deck
      expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("deck");
    });

    it("gains lore when questing (lore = 1)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [merlinCleverClairvoyant],
        deck: [heiheiBoatSnack],
      });

      expect(testEngine.asPlayerOne().quest(merlinCleverClairvoyant)).toBeSuccessfulCommand();

      // Resolve the triggered ability
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ namedCard: "Jafar" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(CANONICAL_PLAYER_ONE)).toBe(1);
    });
  });
});
