/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { giantCobraGhostlySerpent } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  deweyLovableShowoff,
  pullTheLever,
  theSultanRoyalApparition,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
