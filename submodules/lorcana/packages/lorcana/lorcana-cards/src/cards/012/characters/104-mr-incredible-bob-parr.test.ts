import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mrIncredibleBobParr } from "./104-mr-incredible-bob-parr";
import { mrIncredibleSuperStrong } from "./127-mr-incredible-super-strong";

describe("Mr. Incredible - Bob Parr", () => {
  describe("Shift — Mr. Incredible Super Strong can shift onto Bob Parr", () => {
    it("allows Mr. Incredible Super Strong to shift onto Bob Parr for 3 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrIncredibleBobParr, isDrying: false }],
          hand: [mrIncredibleSuperStrong],
          inkwell: 3,
          deck: 5,
        },
        { deck: 5 },
      );

      const bobParrId = testEngine.findCardInstanceId(mrIncredibleBobParr, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(mrIncredibleSuperStrong, {
          cost: { cost: "shift", shiftTarget: bobParrId },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mrIncredibleSuperStrong)).toBe("play");
    });

    it("cannot shift with insufficient ink (needs 3, has 2)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrIncredibleBobParr, isDrying: false }],
          hand: [mrIncredibleSuperStrong],
          inkwell: 2,
          deck: 5,
        },
        { deck: 5 },
      );

      const bobParrId = testEngine.findCardInstanceId(mrIncredibleBobParr, "play", PLAYER_ONE);

      const result = testEngine.asPlayerOne().playCard(mrIncredibleSuperStrong, {
        cost: { cost: "shift", shiftTarget: bobParrId },
      });
      expect(result.success).toBe(false);
    });
  });
});
