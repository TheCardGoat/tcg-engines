import { describe, expect, it } from "bun:test";
import { brawl } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { elsaTheFifthSpirit } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  deweyLovableShowoff,
  donKarnageAirPirateLeader,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Don Karnage - Air Pirate Leader", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [donKarnageAirPirateLeader],
    });

    const cardUnderTest = testEngine.getCardModel(donKarnageAirPirateLeader);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("SCORNFUL TAUNT Whenever you play an action that isn’t a song, chosen opposing character gains Reckless during their next turn. (They can’t quest and must challenge if able.)", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: brawl.cost,
        play: [donKarnageAirPirateLeader, deweyLovableShowoff],
        hand: [brawl],
      },
      {
        play: [elsaTheFifthSpirit],
      },
    );

    const cardActionItem = testEngine.getCardModel(elsaTheFifthSpirit);
    const action = testEngine.getCardModel(brawl);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    expect(target.hasReckless).toEqual(false);

    await testEngine.playCard(action);
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [cardActionItem] }, true);
    await testEngine.resolveTopOfStack({ targets: [target] }, true);

    await testEngine.passTurn();
    testEngine.changeActivePlayer();
    expect(target.hasReckless).toEqual(true);
  });
});
