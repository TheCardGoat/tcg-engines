/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { hadesDoubleDealer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import {
  kuzcoPanickedLlama,
  pongoDearOldDad,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kuzco - Panicked Llama", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [kuzcoPanickedLlama],
    });

    const cardUnderTest = testEngine.getCardModel(kuzcoPanickedLlama);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  describe("WE CAN FIGURE THIS OUT At the start of your turn, choose one: ", () => {
    it("• Each player draws a card. ", async () => {
      const testEngine = new TestEngine(
        {
          deck: 3,
        },
        {
          deck: 3,
          play: [kuzcoPanickedLlama],
        },
      );

      await testEngine.passTurn();
      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ mode: "1" });

      expect(testEngine.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 2,
        }),
      );
      expect(testEngine.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({
          hand: 2,
          deck: 1,
        }),
      );
    });

    it("• Each player chooses and discards a card.", async () => {
      const testEngine = new TestEngine(
        {
          deck: 3,
          hand: [hadesDoubleDealer],
        },
        {
          deck: 3,
          play: [kuzcoPanickedLlama],
          hand: [pongoDearOldDad],
        },
      );

      await testEngine.passTurn();
      await testEngine.resolveTopOfStack({ mode: "2" }, true);

      await testEngine.resolveTopOfStack({ targets: [pongoDearOldDad] }, true);
      expect(testEngine.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 3,
          discard: 1,
        }),
      );

      testEngine.changeActivePlayer("player_one");
      await testEngine.resolveTopOfStack(
        { targets: [hadesDoubleDealer] },
        true,
      );
      expect(testEngine.getZonesCardCount("player_one")).toEqual(
        expect.objectContaining({
          hand: 0,
          deck: 3,
          discard: 1,
        }),
      );

      expect(testEngine.stackLayers).toHaveLength(0);
      expect(testEngine.getZonesCardCount("player_two")).toEqual(
        expect.objectContaining({
          // After effect resolves they draw
          hand: 1,
          deck: 2,
        }),
      );
    });
  });
});
