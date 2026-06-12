import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack, moanaOfMotunui } from "../../001";
import { flynnRiderHisOwnBiggestFan } from "../../002";
import { annaSoothingSister } from "./050-anna-soothing-sister";
import { annaLittleSister } from "./052-anna-little-sister";

describe("Anna - Soothing Sister", () => {
  describe("WARM HEART - Whenever this character quests, you may gain lore equal to the lore of a character card in your discard. If you do, put that card on the bottom of your deck.", () => {
    it("should trigger when questing and gain lore from character in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: annaSoothingSister, isDrying: false }],
        discard: [moanaOfMotunui],
        deck: 10,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Quest with Anna — triggers WARM HEART
      const questResult = testEngine.asPlayerOne().quest(annaSoothingSister);
      expect(questResult).toBeSuccessfulCommand();

      // Check lore after quest (should be 1 from Anna's base quest)
      const loreAfterQuest = testEngine.getLore(PLAYER_ONE);
      expect(loreAfterQuest).toBe(loreBefore + annaSoothingSister.lore);

      // Check bag effects
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      // Resolve WARM HEART: choose Moana from discard
      const moanaId = testEngine.findCardInstanceId(moanaOfMotunui, "discard", PLAYER_ONE);
      const resolveResult = testEngine.asPlayerOne().resolvePendingByCard(annaSoothingSister, {
        resolveOptional: true,
        targets: [moanaId],
      });
      expect(resolveResult).toBeSuccessfulCommand();

      // Should gain Moana's printed lore on top of quest lore
      const loreAfterResolve = testEngine.getLore(PLAYER_ONE);
      expect(loreAfterResolve).toBe(loreBefore + annaSoothingSister.lore + moanaOfMotunui.lore);

      // Moana should be moved to bottom of deck
      expect(testEngine.asPlayerOne().getCardZone(moanaOfMotunui)).toBe("deck");
    });

    it("should use printed lore (Flynn Rider in discard gets full 4 lore)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: annaSoothingSister, isDrying: false }],
          discard: [flynnRiderHisOwnBiggestFan],
          deck: 10,
        },
        {
          hand: [heiheiBoatSnack, heiheiBoatSnack, heiheiBoatSnack],
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(annaSoothingSister)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const flynnId = testEngine.findCardInstanceId(
        flynnRiderHisOwnBiggestFan,
        "discard",
        PLAYER_ONE,
      );
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaSoothingSister, {
          resolveOptional: true,
          targets: [flynnId],
        }),
      ).toBeSuccessfulCommand();

      // 1 from Anna quest + 4 from Flynn's printed lore = 5
      const loreAfter = testEngine.getLore(PLAYER_ONE);
      expect(loreAfter).toBe(loreBefore + 5);

      expect(testEngine.asPlayerOne().getCardZone(flynnRiderHisOwnBiggestFan)).toBe("deck");
    });

    it("should be optional - declining leaves discard untouched and gains no extra lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: annaSoothingSister, isDrying: false }],
        discard: [moanaOfMotunui],
        deck: 10,
      });

      expect(testEngine.asPlayerOne().quest(annaSoothingSister)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaSoothingSister, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Should only have gained 1 lore from questing
      expect(testEngine.getLore(PLAYER_ONE)).toBe(annaSoothingSister.lore);

      // Moana should still be in discard
      expect(testEngine.asPlayerOne().getCardZone(moanaOfMotunui)).toBe("discard");
    });

    it("should auto-decline and create no pending effect when discard has no character cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: annaSoothingSister, isDrying: false }],
        discard: [],
        deck: 10,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(annaSoothingSister)).toBeSuccessfulCommand();

      // No character cards in discard — WARM HEART must auto-decline with no prompt
      expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);

      // Only Anna's quest lore gained
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + annaSoothingSister.lore);
    });
  });

  describe("UNUSUAL TRANSFORMATION - If a card left a player's discard this turn, this card gains Shift 0", () => {
    it("should allow Shift 0 after a card leaves discard via Anna Little Sister's ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [annaLittleSister, annaSoothingSister],
        discard: [heiheiBoatSnack],
        inkwell: annaLittleSister.cost,
        deck: 10,
      });

      // Play Anna Little Sister to trigger UNEXPECTED DISCOVERY
      expect(testEngine.asPlayerOne().playCard(annaLittleSister)).toBeSuccessfulCommand();

      // Resolve UNEXPECTED DISCOVERY: put HeiHei from discard on bottom of deck
      const heiheiId = testEngine.findCardInstanceId(heiheiBoatSnack, "discard", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(annaLittleSister, {
          resolveOptional: true,
          targets: [heiheiId],
        }),
      ).toBeSuccessfulCommand();

      // HeiHei should have moved from discard to deck
      expect(testEngine.asPlayerOne().getCardZone(heiheiBoatSnack)).toBe("deck");

      // Anna Little Sister should still be in play
      expect(testEngine.asPlayerOne().getCardZone(annaLittleSister)).toBe("play");

      // Now a card has left discard this turn; Shift 0 should be available
      const shiftTarget = testEngine.findCardInstanceId(annaLittleSister, "play", PLAYER_ONE);
      expect(shiftTarget).toBeDefined();
      const result = testEngine.asPlayerOne().playCard(annaSoothingSister, {
        cost: { cost: "shift", shiftTarget },
      });
      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(annaSoothingSister)).toBe("play");
    });

    it("should NOT allow Shift 0 when no card has left discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: annaLittleSister, isDrying: false }],
        hand: [annaSoothingSister],
        deck: 10,
        inkwell: 5,
      });

      // No card has left discard — Shift 0 condition should fail
      const shiftTarget = testEngine.findCardInstanceId(annaLittleSister, "play", PLAYER_ONE);
      const result = testEngine.asPlayerOne().playCard(annaSoothingSister, {
        cost: { cost: "shift", shiftTarget },
      });
      expect(result).not.toBeSuccessfulCommand();
    });
  });
});
