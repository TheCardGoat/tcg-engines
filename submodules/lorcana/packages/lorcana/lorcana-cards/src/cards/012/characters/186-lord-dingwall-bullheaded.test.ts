import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lordDingwallBullheaded } from "./186-lord-dingwall-bullheaded";

const friendly = createMockCharacter({
  id: "dingwall-friendly",
  name: "Friendly Ally",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Lord Dingwall - Bullheaded", () => {
  describe("FIGHTIN' TALK - This character may enter play exerted to give chosen character Challenger +3 this turn.", () => {
    it("enters play ready by default and does not grant Challenger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [lordDingwallBullheaded],
        play: [friendly],
        inkwell: lordDingwallBullheaded.cost,
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(lordDingwallBullheaded)).toBeSuccessfulCommand();
      expect(playerOne.isExerted(lordDingwallBullheaded)).toBe(false);

      if (playerOne.getBagCount() > 0) {
        playerOne.resolvePendingByCard(lordDingwallBullheaded);
      }

      expect(playerOne.hasKeyword(friendly, "Challenger")).toBe(false);
    });

    it("enters play exerted and grants Challenger +3 to chosen character this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [lordDingwallBullheaded],
        play: [friendly],
        inkwell: lordDingwallBullheaded.cost,
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(
        playerOne.playCard(lordDingwallBullheaded, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(playerOne.isExerted(lordDingwallBullheaded)).toBe(true);
      expect(playerOne.getBagCount()).toBe(1);

      const friendlyId = testEngine.findCardInstanceId(friendly, "play", "player_one");

      expect(
        playerOne.resolvePendingByCard(lordDingwallBullheaded, {
          targets: [friendlyId],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.hasKeyword(friendly, "Challenger")).toBe(true);
      expect(testEngine.getKeywordValue(friendly, "Challenger")).toBe(3);
    });
  });
});
