/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { giantCobraGhostlySerpent } from "@lorcanito/lorcana-engine/cards/007";
import {
  deweyLovableShowoff,
  pullTheLever,
  theSultanRoyalApparition,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("The Sultan - Royal Apparition", () => {
  it("COMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.", async () => {
    const testEngine = new TestEngine(
      {
        play: [theSultanRoyalApparition, giantCobraGhostlySerpent],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(theSultanRoyalApparition);
    const target = testEngine.getCardModel(giantCobraGhostlySerpent);
    const target2 = testEngine.getCardModel(deweyLovableShowoff);

    expect(target2.exerted).toEqual(false);

    await testEngine.questCard(target);

    // await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target2] });

    expect(target2.exerted).toEqual(true);
  });
});

describe("Regression tests", () => {
  it("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: pullTheLever.cost,
        hand: [pullTheLever],
        deck: 10,
      },
      {
        play: [theSultanRoyalApparition],
      },
    );
    await testEngine.playCard(pullTheLever, { mode: "1" });

    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 2,
        deck: 8,
      }),
    );

    expect(testEngine.getCardModel(theSultanRoyalApparition).zone).toEqual(
      "play",
    );
  });
});
