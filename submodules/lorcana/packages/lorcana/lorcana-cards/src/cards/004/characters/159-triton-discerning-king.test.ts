import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { healingDecanter } from "../../005/items/030-healing-decanter";
import { tritonDiscerningKing } from "./159-triton-discerning-king";

describe("Triton - Discerning King", () => {
  describe("CONSIGN TO THE DEPTHS — {E}, Banish one of your items — Gain 3 lore.", () => {
    it("banishes one of your items and gains 3 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [],
        play: [tritonDiscerningKing, healingDecanter],
      });

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().activateAbility(tritonDiscerningKing, {
          costs: {
            banishItems: [healingDecanter],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(tritonDiscerningKing)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(healingDecanter)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
    });

    it("cannot activate the ability without an item in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [],
        play: [tritonDiscerningKing],
      });

      const result = testEngine.asPlayerOne().activateAbility(tritonDiscerningKing);

      expect(result.success).toBe(false);
    });

    it("exerts Triton after activating the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [],
        play: [tritonDiscerningKing, healingDecanter],
      });

      expect(testEngine.asPlayerOne().isExerted(tritonDiscerningKing)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(tritonDiscerningKing, {
          costs: {
            banishItems: [healingDecanter],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(tritonDiscerningKing)).toBe(true);
    });
  });
});
