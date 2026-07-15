import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { nickWildeSlyFox } from "./150-nick-wilde-sly-fox";

const attacker = createMockCharacter({
  id: "nick-wilde-sf-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const allyItem = createMockItem({
  id: "nick-wilde-sf-item",
  name: "Test Item",
  cost: 2,
});

describe("Nick Wilde - Sly Fox", () => {
  describe("CAN'T TOUCH ME — While you have an item in play, this character can't be challenged.", () => {
    it("cannot be challenged while an item is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: nickWildeSlyFox, exerted: true }, allyItem],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(attacker, nickWildeSlyFox);
      expect(result.success).toBe(false);
    });

    it("can be challenged when no item is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: nickWildeSlyFox, exerted: true }],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(attacker, nickWildeSlyFox);
      expect(result).toBeSuccessfulCommand();
    });
  });

  describe("Shift 1 keyword", () => {
    it("has Shift keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [nickWildeSlyFox],
        deck: 1,
      });

      expect(testEngine.hasKeyword(nickWildeSlyFox, "Shift")).toBe(true);
    });
  });
});
