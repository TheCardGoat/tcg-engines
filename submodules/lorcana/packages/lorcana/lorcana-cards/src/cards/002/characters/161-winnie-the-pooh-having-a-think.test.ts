import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { winnieThePoohHavingAThink } from "./161-winnie-the-pooh-having-a-think";

const handCard = createMockCharacter({
  id: "pooh-hand-card",
  name: "Hand Card",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Winnie the Pooh - Having a Think", () => {
  describe("HUNNY POT - Whenever this character quests, you may put a card from your hand into your inkwell facedown.", () => {
    it("triggers an optional bag effect when Pooh quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: winnieThePoohHavingAThink, isDrying: false }],
          hand: [handCard],
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().quest(winnieThePoohHavingAThink)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("puts the chosen hand card into the inkwell when the ability is resolved", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: winnieThePoohHavingAThink, isDrying: false }],
          hand: [handCard],
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().quest(winnieThePoohHavingAThink)).toBeSuccessfulCommand();

      const handCardId = testEngine.findCardInstanceId(handCard, "hand", "player_one");

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(winnieThePoohHavingAThink, {
          resolveOptional: true,
          targets: [handCardId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 0,
        inkwell: 1,
      });

      const inkedId = testEngine.findCardInstanceId(handCard, "inkwell", "player_one");
      expect(testEngine.isExertedByInstance(inkedId)).toBe(false);
    });

    it("does not move the hand card when the ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: winnieThePoohHavingAThink, isDrying: false }],
          hand: [handCard],
        },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().quest(winnieThePoohHavingAThink)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(winnieThePoohHavingAThink, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 1,
        inkwell: 0,
      });
    });
  });
});
