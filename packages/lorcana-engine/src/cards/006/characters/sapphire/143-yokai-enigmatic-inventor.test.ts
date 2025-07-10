/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  pixieDust,
  poohPirateShip,
  yokaiEnigmaticInventor,
} from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Yokai - Enigmatic Inventor", () => {
  it("TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: pixieDust.cost - 2,
      play: [yokaiEnigmaticInventor, poohPirateShip],
      hand: [pixieDust],
    });
    const targetCard = testEngine.getCardModel(pixieDust);

    await testEngine.questCard(yokaiEnigmaticInventor);
    await testEngine.resolveOptionalAbility();

    expect(targetCard.cost).toEqual(pixieDust.cost);
    await testEngine.resolveTopOfStack({ targets: [poohPirateShip] });
    expect(targetCard.cost).toEqual(pixieDust.cost - 2);

    await testEngine.playCard(pixieDust);

    expect(targetCard.zone).toEqual("play");
    expect(
      testEngine.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(0);
  });
});
