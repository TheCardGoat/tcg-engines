import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, fishboneQuill } from "@tcg/lorcana-cards/cards/001";
import { plutoFriendlyPooch } from "@tcg/lorcana-cards/cards/003";

describe("#### 7. ZONES", () => {
  describe("# 7.5. Inkwell", () => {
    it("7.5.2. Cards enter the inkwell facedown and ready.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [arielOnHumanLegs],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().ink(arielOnHumanLegs)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(arielOnHumanLegs)).toBe(false);
      expect(testEngine.isCardFaceDown(arielOnHumanLegs, "inkwell", PLAYER_ONE)).toBe(true);
    });

    it("7.5.6. Effects can put a non-inkable card into the inkwell facedown as ink.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [plutoFriendlyPooch],
        play: [{ card: fishboneQuill, exerted: false }],
        deck: 1,
      });

      const itemId = testEngine.findCardInstanceId(fishboneQuill, "play", PLAYER_ONE);
      const plutoId = testEngine.findCardInstanceId(plutoFriendlyPooch, "hand", PLAYER_ONE);
      const result = testEngine.executeMoveForView("playerOne", "activateAbility", {
        args: {
          cardId: itemId,
          abilityIndex: 0,
          targets: [plutoId],
        },
      });

      expect(result).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(plutoFriendlyPooch)).toBe("inkwell");
      expect(testEngine.isCardFaceDown(plutoFriendlyPooch, "inkwell", PLAYER_ONE)).toBe(true);
    });
  });
});
