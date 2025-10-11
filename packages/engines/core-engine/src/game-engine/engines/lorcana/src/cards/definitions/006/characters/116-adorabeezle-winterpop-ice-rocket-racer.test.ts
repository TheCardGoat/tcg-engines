import { describe, expect, it } from "bun:test";
import { adorabeezleWinterpopIceRocketRacer } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Adorabeezle Winterpop - Ice Rocket Racer", () => {
  it("KEEP DRIVING While this character has damage, she gets +1 {L}.", async () => {
    const testEngine = new TestEngine({
      play: [adorabeezleWinterpopIceRocketRacer],
    });

    const cardUnderTest = testEngine.getCardModel(
      adorabeezleWinterpopIceRocketRacer,
    );

    expect(cardUnderTest.lore).toEqual(adorabeezleWinterpopIceRocketRacer.lore);

    await testEngine.setCardDamage(cardUnderTest, 1);

    expect(cardUnderTest.lore).toEqual(
      adorabeezleWinterpopIceRocketRacer.lore + 1,
    );
  });
});
