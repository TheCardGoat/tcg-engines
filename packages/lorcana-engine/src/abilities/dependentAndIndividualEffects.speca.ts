/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import { weDontTalkAboutBruno } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { aladdinBraveRescuer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import {
  moveOpponentCharacterToHand,
  opponentDiscardsARandomCard,
} from "@lorcanito/lorcana-engine/effects/effects";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Abilities with both resolveEffectsIndividually and dependentEffects", () => {
  // We don't talk about bruno ability changed
  it.skip("First effect requires target and the second does not, it should wait first resolve.", () => {
    const testStore = new TestStore(
      {
        inkwell: weDontTalkAboutBruno.cost,
        hand: [weDontTalkAboutBruno],
      },
      {
        play: [aladdinBraveRescuer],
      },
    );

    const cardUnderTest = testStore.getCard(weDontTalkAboutBruno);
    const target = testStore.getCard(aladdinBraveRescuer);

    cardUnderTest.playFromHand();

    expect(testStore.stackLayers).toHaveLength(2);
    expect(
      JSON.stringify(testStore.stackLayers[1]?.ability.effects[0]?.effect),
    ).toEqual(JSON.stringify(moveOpponentCharacterToHand));
    expect(
      JSON.stringify(testStore.stackLayers[0]?.ability.effects[0]?.effect),
    ).toEqual(JSON.stringify(opponentDiscardsARandomCard));
    testStore.resolveTopOfStack({ targets: [target] }, true);

    expect(target.zone).toBe("discard");
    expect(testStore.stackLayers).toHaveLength(0);
  });

  it.skip("Invalid target for first, should cancel second", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: weDontTalkAboutBruno.cost,
        hand: [weDontTalkAboutBruno],
      },
      {
        hand: [aladdinBraveRescuer],
      },
    );

    await testEngine.playCard(weDontTalkAboutBruno);
    expect(testEngine.stackLayers).toHaveLength(0);
    // await testEngine.resolveTopOfStack({ targets: [target] }, true);
    //
    // expect(target.zone).toBe("hand");
    // expect(testEngine.stackLayers).toHaveLength(0);
  });
});
