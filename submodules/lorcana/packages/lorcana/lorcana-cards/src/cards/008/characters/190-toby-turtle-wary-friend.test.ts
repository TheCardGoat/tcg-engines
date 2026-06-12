import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { tobyTurtleWaryFriend } from "./190-toby-turtle-wary-friend";

// Attacker with strength 2 to challenge Toby (0 strength, 4 willpower)
const attacker = createMockCharacter({
  id: "toby-test-attacker",
  name: "Test Attacker",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Toby Turtle - Wary Friend", () => {
  describe("HARD SHELL - While this character is exerted, he gains Resist +1.", () => {
    it("does NOT have Resist when ready (not exerted)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tobyTurtleWaryFriend],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(tobyTurtleWaryFriend, "Resist")).toBe(false);
    });

    it("gains Resist +1 when exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: tobyTurtleWaryFriend, exerted: true }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(tobyTurtleWaryFriend, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(tobyTurtleWaryFriend, "Resist")).toBe(1);
    });

    it("reduces damage by 1 when exerted — attacker with strength 2 deals only 1 damage", () => {
      // Player ONE has attacker; player TWO has Toby exerted (HARD SHELL is active)
      // Attacker strength 2 → 2 - 1 Resist = 1 damage to Toby
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: tobyTurtleWaryFriend, exerted: true }],
          deck: 5,
        },
      );

      const tobyId = testEngine.findCardInstanceId(tobyTurtleWaryFriend, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().challenge(attacker, tobyTurtleWaryFriend),
      ).toBeSuccessfulCommand();

      // Toby has Resist +1 while exerted → 2 strength - 1 Resist = 1 damage
      expect(testEngine.asServer().getCard(tobyId).damage).toBe(1);
    });
  });
});
