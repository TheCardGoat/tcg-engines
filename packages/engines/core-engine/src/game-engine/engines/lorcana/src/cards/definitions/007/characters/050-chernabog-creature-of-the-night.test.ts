/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { chernabogCreatureOfTheNight } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("Chernabog - Creature of the Night", () => {
  it("MIDNIGHT FESTIVITIES When you play this character, each opponent chooses one of their readied characters and exhausts it. Characters exhausted this way do not ready at the start of their next turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: chernabogCreatureOfTheNight.cost,
        hand: [chernabogCreatureOfTheNight],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const target = testEngine.getCardModel(deweyLovableShowoff);
    // const cardUnderTest = testEngine.getCardModel(chernabogCreatureOfTheNight);
    expect(target.exerted).toBe(false);

    await testEngine.playCard(chernabogCreatureOfTheNight);

    testEngine.changeActivePlayer("player_two");
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.exerted).toBe(true);

    testEngine.passTurn();

    expect(target.exerted).toBe(true);
  });
});
