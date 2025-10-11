import { describe, expect, it } from "bun:test";
import {
  pixieDust,
  poohPirateShip,
  yokaiEnigmaticInventor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
