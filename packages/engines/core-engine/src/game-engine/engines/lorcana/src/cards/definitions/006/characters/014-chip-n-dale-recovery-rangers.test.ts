/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mickeyMouseDetective } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { tipoGrowingSon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  chipFriendIndeed,
  chipNDaleRecoveryRangers,
  daleFriendInNeed,
  dawsonBasilsAssistant,
  gadgetHackwrenchPerceptiveMouse,
  rafikiShamanOfTheSavanna,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Chip 'n' Dale - Recovery Rangers", () => {
  describe("Shift", () => {
    it("Shifts from Dale", async () => {
      const testEngine = new TestEngine({
        inkwell: 5,
        hand: [chipNDaleRecoveryRangers],
        play: [daleFriendInNeed],
      });

      const { shifter } = await testEngine.shiftCard({
        shifted: daleFriendInNeed,
        shifter: chipNDaleRecoveryRangers,
      });

      expect(shifter.zone).toEqual("play");
    });

    it("Shifts from Chip", async () => {
      const testEngine = new TestEngine({
        inkwell: 5,
        hand: [chipNDaleRecoveryRangers],
        play: [chipFriendIndeed],
      });

      const { shifter } = await testEngine.shiftCard({
        shifted: chipFriendIndeed,
        shifter: chipNDaleRecoveryRangers,
      });

      expect(shifter.zone).toEqual("play");
    });
  });

  describe("Search And Rescue", () => {
    it("During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.", async () => {
      const testEngine = new TestEngine({
        inkwell: mickeyMouseDetective.cost + mickeyMouseDetective.cost,
        deck: 2,
        hand: [
          rafikiShamanOfTheSavanna,
          mickeyMouseDetective,
          tipoGrowingSon,
          dawsonBasilsAssistant,
        ],
        discard: [gadgetHackwrenchPerceptiveMouse],
        play: [chipNDaleRecoveryRangers],
      });

      await testEngine.putIntoInkwell(rafikiShamanOfTheSavanna);
      expect(testEngine.stackLayers).toHaveLength(1);
      await testEngine.skipTopOfStack();

      await testEngine.playCard(mickeyMouseDetective);
      await testEngine.acceptOptionalLayer();
      expect(testEngine.stackLayers).toHaveLength(1);
      await testEngine.skipTopOfStack();

      await testEngine.playCard(
        tipoGrowingSon,
        {
          targets: [dawsonBasilsAssistant],
        },
        true,
      );
      expect(testEngine.stackLayers).toHaveLength(1);
      await testEngine.skipTopOfStack();

      expect(testEngine.stackLayers).toHaveLength(0);
    });
  });
});
