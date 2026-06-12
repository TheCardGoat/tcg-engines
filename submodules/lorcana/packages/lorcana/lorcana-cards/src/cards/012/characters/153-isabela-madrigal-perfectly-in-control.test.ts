import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { isabelaMadrigalPerfectlyInControl } from "./153-isabela-madrigal-perfectly-in-control";

const damagedAlly = createMockCharacter({
  id: "isabela-test-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 6,
});

describe("Isabela Madrigal - Perfectly in Control", () => {
  describe("FEEL BETTER - When you play this character and whenever she quests, you may move all damage from chosen character of yours to this character.", () => {
    it("moves all damage from a chosen friendly character to Isabela on play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [isabelaMadrigalPerfectlyInControl],
        play: [{ card: damagedAlly, damage: 3 }],
        inkwell: isabelaMadrigalPerfectlyInControl.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(isabelaMadrigalPerfectlyInControl),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalPerfectlyInControl, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(isabelaMadrigalPerfectlyInControl)).toBe(3);
    });

    it("may decline the optional trigger on play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [isabelaMadrigalPerfectlyInControl],
        play: [{ card: damagedAlly, damage: 3 }],
        inkwell: isabelaMadrigalPerfectlyInControl.cost,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(isabelaMadrigalPerfectlyInControl),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalPerfectlyInControl, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(3);
      expect(testEngine.asPlayerOne().getDamage(isabelaMadrigalPerfectlyInControl)).toBe(0);
    });

    it("moves all damage from a chosen friendly character to Isabela on quest", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: isabelaMadrigalPerfectlyInControl, isDrying: false },
          { card: damagedAlly, damage: 2 },
        ],
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().quest(isabelaMadrigalPerfectlyInControl),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalPerfectlyInControl, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(isabelaMadrigalPerfectlyInControl)).toBe(2);
    });
  });

  describe("SELF-CARE - At the end of your turn, you may remove all damage from this character.", () => {
    it("removes all damage from Isabela at end of turn when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          {
            card: isabelaMadrigalPerfectlyInControl,
            isDrying: false,
            damage: 4,
          },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalPerfectlyInControl, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(isabelaMadrigalPerfectlyInControl)).toBe(0);
    });

    it("keeps damage when SELF-CARE is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          {
            card: isabelaMadrigalPerfectlyInControl,
            isDrying: false,
            damage: 4,
          },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalPerfectlyInControl, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(isabelaMadrigalPerfectlyInControl)).toBe(4);
    });
  });
});
