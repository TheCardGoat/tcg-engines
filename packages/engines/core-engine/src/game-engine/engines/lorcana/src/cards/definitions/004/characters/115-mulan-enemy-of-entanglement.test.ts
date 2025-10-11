import { describe, expect, it } from "bun:test";
import { packTactics } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { mulanEnemyOfEntanglement } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  gatheringKnowledgeAndWisdom,
  rememberWhoYouAre,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mulan - Enemy of Entanglement", () => {
  it("**TIME TO SHINE** Whenever you play an action, this character gets +2 {S} this turn.", () => {
    const testEngine = new TestEngine({
      inkwell: 90,
      play: [mulanEnemyOfEntanglement],
      hand: [gatheringKnowledgeAndWisdom, rememberWhoYouAre, packTactics],
    });

    const cardUnderTest = testEngine.getCardModel(mulanEnemyOfEntanglement);
    expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength);

    testEngine.playCard(gatheringKnowledgeAndWisdom);
    expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength + 2);

    testEngine.playCard(rememberWhoYouAre);
    expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength + 4);

    testEngine.playCard(packTactics);
    expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength + 6);
  });
});
