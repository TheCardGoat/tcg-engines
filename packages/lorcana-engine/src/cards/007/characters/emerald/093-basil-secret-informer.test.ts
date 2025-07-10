/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { tinkerBellGiantFairy } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import { beastTragicHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { basilSecretInformer } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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

    expect(testEngine.getCardModel(beastTragicHero).hasReckless).toBe(false);
    expect(testEngine.getCardModel(tinkerBellGiantFairy).hasReckless).toBe(
      false,
    );

    testEngine.getCardModel(beastTragicHero).updateCardDamage(2, "add");

    expect(testEngine.getCardModel(beastTragicHero).damage).toEqual(2);

    await testEngine.questCard(basilSecretInformer);

    await testEngine.passTurn();

    expect(testEngine.getCardModel(beastTragicHero).hasReckless).toBe(true);
    expect(testEngine.getCardModel(tinkerBellGiantFairy).hasReckless).toBe(
      false,
    );
  });
});
