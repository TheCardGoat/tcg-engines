/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  annaIceBreaker,
  elsaIceMaker,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("Elsa - Ice Maker", () => {
  it("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Elsa.)", async () => {
    const testEngine = new TestEngine({
      play: [elsaIceMaker],
    });

    const cardUnderTest = testEngine.getCardModel(elsaIceMaker);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  describe("WINTER WALL Whenever this character quests, you may exert chosen character. If you do and you have a character named Anna in play, the chosen character can’t ready at the start of their next turn.", () => {
    it("Anna is in play", async () => {
      const testEngine = new TestEngine(
        {
          play: [elsaIceMaker, annaIceBreaker],
        },
        {
          play: [deweyLovableShowoff],
        },
      );

      const cardUnderTest = testEngine.getCardModel(elsaIceMaker);
      const target = testEngine.getCardModel(deweyLovableShowoff);

      await testEngine.questCard(cardUnderTest);

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [target] });

      // Your turn
      expect(target.exerted).toBe(true);

      // Opponent's turn
      testEngine.passTurn();
      expect(target.exerted).toBe(true);

      // Your turn
      testEngine.passTurn();
      expect(target.exerted).toBe(true);

      // Opponent's turn
      testEngine.passTurn();
      expect(target.exerted).toBe(false);
    });

    it("Anna is in NOT play", async () => {
      const testEngine = new TestEngine(
        {
          play: [elsaIceMaker],
        },
        {
          play: [deweyLovableShowoff],
        },
      );

      const cardUnderTest = testEngine.getCardModel(elsaIceMaker);
      const target = testEngine.getCardModel(deweyLovableShowoff);

      await testEngine.questCard(cardUnderTest);

      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [target] });

      // Your turn
      expect(target.exerted).toBe(true);

      // Opponent's turn
      testEngine.passTurn();
      expect(target.exerted).toBe(false);
    });
  });
});
