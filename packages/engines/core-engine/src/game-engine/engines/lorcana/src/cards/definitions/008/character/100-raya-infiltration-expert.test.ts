import { describe, expect, it } from "bun:test";
import {
  deweyLovableShowoff,
  rayaInfiltrationExpert,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Raya - Infiltration Expert", () => {
  it("UNCONVENTIONAL TACTICS Whenever this character quests, you may pay 2 {I} to ready another chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: rayaInfiltrationExpert.cost,
      play: [rayaInfiltrationExpert, deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(rayaInfiltrationExpert);
    const target = testEngine.getCardModel(deweyLovableShowoff);
    target.exert();
    expect(target.ready).toEqual(false);

    await testEngine.questCard(cardUnderTest);
    await testEngine.resolveOptionalAbility();

    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.ready).toEqual(true);
  });
});
