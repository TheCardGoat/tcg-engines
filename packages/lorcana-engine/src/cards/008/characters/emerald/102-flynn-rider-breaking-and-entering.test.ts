/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  flynnRiderBreakingAndEntering,
  montereyJackDefiantProtector,
  wasabiAlwaysPrepared,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Flynn Rider - Breaking and Entering", () => {
  describe("THIS IS A VERY BIG DAY Whenever this character is challenged, the challenging player may choose and discard a card. If they don’t, you gain 2 lore.", () => {
    it("Discarding a card", async () => {
      const testEngine = new TestEngine(
        {
          play: [wasabiAlwaysPrepared],
          hand: [montereyJackDefiantProtector],
        },
        {
          play: [flynnRiderBreakingAndEntering],
        },
      );

      await testEngine.challenge({
        defender: flynnRiderBreakingAndEntering,
        attacker: wasabiAlwaysPrepared,
        exertDefender: true,
      });

      await testEngine.resolveTopOfStack(
        {
          mode: "1",
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        targets: [montereyJackDefiantProtector],
      });

      expect(testEngine.getCardModel(montereyJackDefiantProtector).zone).toBe(
        "discard",
      );
      expect(testEngine.getPlayerLore()).toBe(0);
      expect(testEngine.getPlayerLore("player_two")).toBe(0);
    });

    it("gain lore", async () => {
      const testEngine = new TestEngine(
        {
          play: [wasabiAlwaysPrepared],
          hand: [montereyJackDefiantProtector],
        },
        {
          play: [flynnRiderBreakingAndEntering],
        },
      );

      await testEngine.challenge({
        defender: flynnRiderBreakingAndEntering,
        attacker: wasabiAlwaysPrepared,
        exertDefender: true,
      });

      await testEngine.resolveTopOfStack({
        mode: "2",
      });

      expect(testEngine.getCardModel(montereyJackDefiantProtector).zone).toBe(
        "hand",
      );
      expect(testEngine.getPlayerLore("player_two")).toBe(2);
    });
  });
});
