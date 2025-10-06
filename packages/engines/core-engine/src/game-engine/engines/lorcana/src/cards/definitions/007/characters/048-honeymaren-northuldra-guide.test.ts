/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  neverLandMermaidLagoon,
  prideLandsPrideRock,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";
import {
  belleApprenticeInventor,
  boltHeadstrongDog,
  honeymarenNorthuldraGuide,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Honeymaren - Northuldra Guide", () => {
  describe("TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.", () => {
    it("gain 1 lore when the opponent has an exerted character in play", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: honeymarenNorthuldraGuide.cost,
          hand: [honeymarenNorthuldraGuide],
        },
        {
          play: [boltHeadstrongDog],
        },
      );

      await testEngine.tapCard(boltHeadstrongDog);
      const initialLore = testEngine.getLoreForPlayer("player_one");

      await testEngine.playCard(honeymarenNorthuldraGuide);
      const finalLore = testEngine.getLoreForPlayer("player_one");

      expect(finalLore).toBe(initialLore + 1);
    });

    it("does NOT gain 1 lore if the opponent has no exerted character in play", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: honeymarenNorthuldraGuide.cost,
          hand: [honeymarenNorthuldraGuide],
        },
        {
          play: [boltHeadstrongDog],
        },
      );

      const initialLore = testEngine.getLoreForPlayer("player_one");

      await testEngine.playCard(honeymarenNorthuldraGuide);
      const finalLore = testEngine.getLoreForPlayer("player_one");

      expect(finalLore).toBe(initialLore);
    });

    it("does NOT gain 1 lore if player own character is exerted", async () => {
      const testEngine = new TestEngine({
        inkwell: honeymarenNorthuldraGuide.cost,
        hand: [honeymarenNorthuldraGuide],
        play: [boltHeadstrongDog],
      });

      await testEngine.tapCard(boltHeadstrongDog);
      const initialLore = testEngine.getLoreForPlayer("player_one");

      await testEngine.playCard(honeymarenNorthuldraGuide);
      const finalLore = testEngine.getLoreForPlayer("player_one");

      expect(finalLore).toBe(initialLore);
    });
  });
});

describe("Regression tests", () => {
  it("does NOT gain 1 lore for location", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: honeymarenNorthuldraGuide.cost,
        hand: [honeymarenNorthuldraGuide],
        play: [boltHeadstrongDog, neverLandMermaidLagoon],
      },
      {
        play: [belleApprenticeInventor, prideLandsPrideRock],
      },
    );

    const initialLore = testEngine.getLoreForPlayer("player_one");
    await testEngine.playCard(honeymarenNorthuldraGuide);
    const finalLore = testEngine.getLoreForPlayer("player_one");

    expect(finalLore).toBe(initialLore);
  });
});
