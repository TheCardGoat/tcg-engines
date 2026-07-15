import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { scroopOdiousMutineer } from "./082-scroop-odious-mutineer";

const damagedTarget = createMockCharacter({
  id: "scroop-damaged-target",
  name: "Damaged Target",
  cost: 3,
  willpower: 4,
});

describe("Scroop - Odious Mutineer", () => {
  describe("Evasive", () => {
    it("has Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroopOdiousMutineer],
      });

      expect(testEngine.asPlayerOne().hasKeyword(scroopOdiousMutineer, "Evasive")).toBe(true);
    });
  });

  describe("DO SAY HELLO TO MR. ARROW - When you play this character, you may pay 3 {I} to banish chosen damaged character.", () => {
    it("banishes a chosen damaged character when the optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [scroopOdiousMutineer],
          inkwell: scroopOdiousMutineer.cost + 3,
          deck: 2,
        },
        {
          play: [{ card: damagedTarget, damage: 2 }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(scroopOdiousMutineer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroopOdiousMutineer, {
          targets: [damagedTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(damagedTarget)).toBe("discard");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [scroopOdiousMutineer],
          inkwell: scroopOdiousMutineer.cost + 3,
          deck: 2,
        },
        {
          play: [{ card: damagedTarget, damage: 2 }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(scroopOdiousMutineer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(scroopOdiousMutineer, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(damagedTarget)).toBe("play");
    });
  });
});
