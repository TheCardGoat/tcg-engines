/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { sisuEmpoweredSibling } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { tweedleDeeAndTweedleDumStrangeStorytellers } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.", () => {
  it("should return damaged character", async () => {
    const testStore = new TestStore({
      inkwell: 10,
      play: [tweedleDeeAndTweedleDumStrangeStorytellers, sisuEmpoweredSibling],
      hand: [letTheStormRageOn],
    });

    /*expect(testEngine.getCardModel(tweedleDeeAndTweedleDumStrangeStorytellers).getNativeAbilities.length).toEqual(1);

    await testEngine.playCard(
      letTheStormRageOn,
      {
        targets: [sisuEmpoweredSibling],
      },
      true,
    );
    
    expect(testEngine.getCardModel(sisuEmpoweredSibling).damage).toEqual(2);
    await testEngine.questCard(tweedleDeeAndTweedleDumStrangeStorytellers);
    
    expect(testEngine.stackLayers).toHaveLength(1);
    await testEngine.resolveTopOfStack({ targets: [sisuEmpoweredSibling] });*/

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      tweedleDeeAndTweedleDumStrangeStorytellers.id,
    );
    const target = testStore.getByZoneAndId("play", sisuEmpoweredSibling.id);

    target.damage = 2;

    cardUnderTest.quest();
    testStore.resolveOptionalAbility();
    expect(testStore.stackLayers).toHaveLength(1);

    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("hand");
  });
});
