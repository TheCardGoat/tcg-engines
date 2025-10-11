import { describe, expect, it } from "bun:test";
import { tinkerBellGiantFairy } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { letTheStormRageOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { beastTragicHero } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { basilSecretInformer } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)", () => {
  it("should give Reckless to damaged opposing characters, when questing", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: 10,
        play: [basilSecretInformer],
        hand: [letTheStormRageOn],
      },
      {
        inkwell: 10,
        play: [beastTragicHero, tinkerBellGiantFairy],
        hand: [],
      },
    );

    /*await testEngine.playCard(
      letTheStormRageOn,
      {
        targets: [beastTragicHero],
      },
      true,
    );*/

    expect(testEngine.getCardModel(beastTragicHero).hasReckless()).toBe(false);
    expect(testEngine.getCardModel(tinkerBellGiantFairy).hasReckless()).toBe(
      false,
    );

    testEngine.getCardModel(beastTragicHero).updateCardDamage(2, "add");

    expect(testEngine.getCardModel(beastTragicHero).damage).toEqual(2);

    await testEngine.questCard(basilSecretInformer);

    await testEngine.passTurn();

    expect(testEngine.getCardModel(beastTragicHero).hasReckless()).toBe(true);
    expect(testEngine.getCardModel(tinkerBellGiantFairy).hasReckless()).toBe(
      false,
    );
  });
});
