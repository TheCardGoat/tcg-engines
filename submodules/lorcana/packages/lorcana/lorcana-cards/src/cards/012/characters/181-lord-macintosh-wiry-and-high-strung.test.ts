import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lordMacintoshWiryAndHighstrung } from "./181-lord-macintosh-wiry-and-high-strung";

const ally = createMockCharacter({
  id: "lord-macintosh-ally",
  name: "Friendly Ally",
  cost: 3,
  strength: 3,
  willpower: 5,
});

describe("Lord Macintosh - Wiry and High-Strung", () => {
  describe("TOUGH IT OUT - This character may enter play exerted to give chosen character Resist +2 until the start of your next turn.", () => {
    it("enters play ready by default and does not grant Resist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lordMacintoshWiryAndHighstrung],
          inkwell: lordMacintoshWiryAndHighstrung.cost,
          play: [ally],
          deck: 3,
        },
        { deck: 3 },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(lordMacintoshWiryAndHighstrung)).toBeSuccessfulCommand();
      expect(playerOne.isExerted(lordMacintoshWiryAndHighstrung)).toBe(false);

      if (playerOne.getBagCount() > 0) {
        playerOne.resolvePendingByCard(lordMacintoshWiryAndHighstrung);
      }

      expect(playerOne.hasKeyword(ally, "Resist")).toBe(false);
    });

    it("enters play exerted and grants Resist +2 to chosen character when resolveOptional is true", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lordMacintoshWiryAndHighstrung],
          inkwell: lordMacintoshWiryAndHighstrung.cost,
          play: [ally],
          deck: 3,
        },
        { deck: 3 },
      );

      const playerOne = testEngine.asPlayerOne();

      expect(
        playerOne.playCard(lordMacintoshWiryAndHighstrung, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(playerOne.isExerted(lordMacintoshWiryAndHighstrung)).toBe(true);
      expect(playerOne.getBagCount()).toBe(1);

      const allyId = testEngine.findCardInstanceId(ally, "play", "player_one");

      expect(
        playerOne.resolvePendingByCard(lordMacintoshWiryAndHighstrung, {
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.hasKeyword(ally, "Resist")).toBe(true);
    });
  });
});
