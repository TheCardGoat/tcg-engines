/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  deweyLovableShowoff,
  rapunzelHighClimber,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Rapunzel - High Climber", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [rapunzelHighClimber],
    });

    const cardUnderTest = testEngine.getCardModel(rapunzelHighClimber);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("WRAPPED UP Whenever this character quests, chosen opposing character can't quest during their next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: rapunzelHighClimber.cost,
        play: [rapunzelHighClimber],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(rapunzelHighClimber);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.questCard(cardUnderTest);
    await testEngine.resolveTopOfStack({ targets: [target] });

    testEngine.passTurn();
    expect(target.canQuest).toBe(false);
  });
});
