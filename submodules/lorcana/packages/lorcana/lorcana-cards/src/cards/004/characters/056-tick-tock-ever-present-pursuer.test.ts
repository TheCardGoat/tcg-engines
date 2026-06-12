import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ticktockEverpresentPursuer } from "./056-tick-tock-ever-present-pursuer";

const nonEvasiveAttacker = createMockCharacter({
  id: "tick-tock-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const evasiveAttacker = createMockCharacter({
  id: "tick-tock-evasive-attacker",
  name: "Evasive Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
  abilities: [
    {
      id: "tick-tock-evasive-attacker-kw",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Tick-Tock - Ever-Present Pursuer", () => {
  describe("Evasive", () => {
    it("has Evasive keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [ticktockEverpresentPursuer],
      });

      const cardUnderTest = testEngine.getCardModel(ticktockEverpresentPursuer);
      expect(cardUnderTest.hasEvasive).toBe(true);
    });

    it("cannot be challenged by a non-Evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [nonEvasiveAttacker],
          deck: 2,
        },
        {
          play: [{ card: ticktockEverpresentPursuer, exerted: true }],
          deck: 2,
        },
      );

      const result = testEngine
        .asPlayerOne()
        .challenge(nonEvasiveAttacker, ticktockEverpresentPursuer);
      expect(result.success).toBe(false);
    });

    it("can be challenged by an Evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [evasiveAttacker],
          deck: 2,
        },
        {
          play: [{ card: ticktockEverpresentPursuer, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(evasiveAttacker, ticktockEverpresentPursuer),
      ).toBeSuccessfulCommand();
    });
  });
});
