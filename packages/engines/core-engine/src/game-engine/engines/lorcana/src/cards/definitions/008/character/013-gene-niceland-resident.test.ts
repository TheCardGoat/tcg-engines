/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  deweyLovableShowoff,
  geneNicelandResident,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gene - Niceland Resident", () => {
  it("I GUESS YOU EARNED THIS Whenever this character quests, you may remove up to 2 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      play: [geneNicelandResident, deweyLovableShowoff],
    });

    const cardToTest = testEngine.getCardModel(geneNicelandResident);
    const cardTarget = testEngine.getCardModel(deweyLovableShowoff);
    cardTarget.damage = 2;

    await cardToTest.quest();

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [cardTarget] });

    expect(cardTarget.damage).toEqual(0);
  });
});
