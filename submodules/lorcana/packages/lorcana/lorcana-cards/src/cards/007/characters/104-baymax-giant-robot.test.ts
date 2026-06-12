import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { baymaxGiantRobot } from "./104-baymax-giant-robot";
import { baymaxLowBattery } from "./087-baymax-low-battery";

describe("Baymax - Giant Robot", () => {
  it("should have Universal Shift 4 keyword ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [baymaxGiantRobot],
    });

    expect(testEngine.hasKeyword(baymaxGiantRobot, "Shift")).toBe(true);
  });

  describe("FUNCTIONALITY IMPROVED - When you play this character, if you used Shift to play him, remove all damage from him.", () => {
    it("removes all damage when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: baymaxGiantRobot.cost,
        hand: [baymaxGiantRobot],
        play: [{ card: baymaxLowBattery, damage: 3 }],
      });

      const shiftTarget = testEngine.findCardInstanceId(baymaxLowBattery, "play", "player_one");

      expect(
        testEngine.asPlayerOne().playCard(baymaxGiantRobot, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // After shifting, the FUNCTIONALITY IMPROVED ability should trigger and remove all damage
      const baymaxId = testEngine.findCardInstanceId(baymaxGiantRobot, "play", "player_one");

      // Resolve the triggered ability bag if present
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(baymaxGiantRobot);
      }

      const baymax = testEngine.asServer().getCard(baymaxId);
      expect(baymax.damage).toBe(0);
    });

    it("does not trigger when played normally (without Shift)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: baymaxGiantRobot.cost,
        hand: [baymaxGiantRobot],
      });

      expect(testEngine.asPlayerOne().playCard(baymaxGiantRobot)).toBeSuccessfulCommand();

      // The ability should not trigger at all when not played via Shift
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      const baymaxId = testEngine.findCardInstanceId(baymaxGiantRobot, "play", "player_one");
      const baymax = testEngine.asServer().getCard(baymaxId);
      expect(baymax.damage).toBe(0);
    });
  });
});
