import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { moanaOfMotunui } from "../../001";
import { flynnRiderHisOwnBiggestFan } from "../../002";
import { annaSoothingSisterEnchanted } from "./227-anna-soothing-sister-enchanted";

describe("Anna - Soothing Sister (Enchanted)", () => {
  describe("WARM HEART - Whenever this character quests, you may gain lore equal to the {L} of a character card in your discard. If you do, put that card on the bottom of your deck.", () => {
    it("should trigger when questing and gain lore from character in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [annaSoothingSisterEnchanted],
        discard: [moanaOfMotunui],
        deck: 10,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      const questResult = testEngine.asPlayerOne().quest(annaSoothingSisterEnchanted);
      expect(questResult).toBeSuccessfulCommand();

      const loreAfterQuest = testEngine.getLore(PLAYER_ONE);
      expect(loreAfterQuest).toBe(loreBefore + annaSoothingSisterEnchanted.lore);

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const moanaId = testEngine.findCardInstanceId(moanaOfMotunui, "discard", PLAYER_ONE);
      const resolveResult = testEngine
        .asPlayerOne()
        .resolvePendingByCard(annaSoothingSisterEnchanted, {
          resolveOptional: true,
          targets: [moanaId],
        });
      expect(resolveResult).toBeSuccessfulCommand();

      const loreAfterResolve = testEngine.getLore(PLAYER_ONE);
      expect(loreAfterResolve).toBe(
        loreBefore + annaSoothingSisterEnchanted.lore + moanaOfMotunui.lore,
      );

      expect(testEngine.asPlayerOne().getCardZone(moanaOfMotunui)).toBe("deck");
    });

    it("should use printed lore (Flynn Rider in discard gets full 4 lore)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [annaSoothingSisterEnchanted],
        discard: [flynnRiderHisOwnBiggestFan],
        deck: 10,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(annaSoothingSisterEnchanted)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const flynnId = testEngine.findCardInstanceId(
        flynnRiderHisOwnBiggestFan,
        "discard",
        PLAYER_ONE,
      );
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaSoothingSisterEnchanted, {
          resolveOptional: true,
          targets: [flynnId],
        }),
      ).toBeSuccessfulCommand();

      // 1 from Anna quest + 4 from Flynn's printed lore = 5
      const loreAfter = testEngine.getLore(PLAYER_ONE);
      expect(loreAfter).toBe(loreBefore + 5);

      expect(testEngine.asPlayerOne().getCardZone(flynnRiderHisOwnBiggestFan)).toBe("deck");
    });

    it("should allow declining the optional effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [annaSoothingSisterEnchanted],
        discard: [moanaOfMotunui],
        deck: 10,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(annaSoothingSisterEnchanted)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(annaSoothingSisterEnchanted, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Only quest lore, no bonus
      const loreAfter = testEngine.getLore(PLAYER_ONE);
      expect(loreAfter).toBe(loreBefore + annaSoothingSisterEnchanted.lore);

      // Moana should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(moanaOfMotunui)).toBe("discard");
    });
  });
});
