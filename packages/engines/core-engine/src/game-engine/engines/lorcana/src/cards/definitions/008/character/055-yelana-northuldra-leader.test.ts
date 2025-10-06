/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  deweyLovableShowoff,
  yelanaNorthuldraLeader,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Yelana - Northuldra Leader", () => {
  it("WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
    const testEngine = new TestEngine({
      inkwell: yelanaNorthuldraLeader.cost,
      hand: [yelanaNorthuldraLeader],
      play: [deweyLovableShowoff],
    });

    const cardGainsChalleng = testEngine.getCardModel(deweyLovableShowoff);
    expect(cardGainsChalleng.hasChallenger).toBe(false);
    await testEngine.playCard(yelanaNorthuldraLeader);
    await testEngine.resolveTopOfStack({ targets: [cardGainsChalleng] });
    expect(cardGainsChalleng.hasChallenger).toBe(true);
    // await testEngine.acceptOptionalLayer();
    //
  });
});
