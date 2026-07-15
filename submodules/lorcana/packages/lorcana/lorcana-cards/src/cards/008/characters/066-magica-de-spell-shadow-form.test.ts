import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { magicaDeSpellShadowForm } from "./066-magica-de-spell-shadow-form";

const friendlyCharacter = createMockCharacter({
  id: "magica-friendly-target",
  name: "Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Magica De Spell - Shadow Form", () => {
  describe("Evasive", () => {
    it("has the Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicaDeSpellShadowForm],
      });

      expect(testEngine.asPlayerOne().hasKeyword(magicaDeSpellShadowForm, "Evasive")).toBe(true);
    });
  });

  describe("DANCE OF DARKNESS - When you play this character, you may return one of your other characters to your hand to draw a card.", () => {
    it("returns another character to hand and draws a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: friendlyCharacter, isDrying: false }],
        hand: [magicaDeSpellShadowForm],
        inkwell: magicaDeSpellShadowForm.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(magicaDeSpellShadowForm)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicaDeSpellShadowForm),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [friendlyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(friendlyCharacter)).toBe("hand");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 4 });
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: friendlyCharacter, isDrying: false }],
        hand: [magicaDeSpellShadowForm],
        inkwell: magicaDeSpellShadowForm.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(magicaDeSpellShadowForm)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicaDeSpellShadowForm, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(friendlyCharacter)).toBe("play");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 5 });
    });
  });
});
