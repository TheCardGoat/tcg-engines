/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  deweyLovableShowoff,
  thumperYoungBunny,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Thumper - Young Bunny", () => {
  it("YOU CAN DO IT! {E} – Chosen character gets +3 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      play: [thumperYoungBunny, deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(thumperYoungBunny);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.activateCard(cardUnderTest, {
      ability: "YOU CAN DO IT!",
      targets: [target],
    });

    expect(target.strength).toBe(deweyLovableShowoff.strength + 3);
  });
});
