/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { elsaTheFifthSpirit } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import {
  deweyLovableShowoff,
  donKarnageAirPirateLeader,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
