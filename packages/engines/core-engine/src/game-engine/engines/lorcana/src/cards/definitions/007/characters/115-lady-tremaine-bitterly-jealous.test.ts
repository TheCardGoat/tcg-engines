/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { diabloDevotedHerald } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { ladyTremaineBitterlyJealous } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("Lady Tremaine - Bitterly Jealous", () => {
  it("THAT'S QUITE ENOUGH {E} – Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.", async () => {
    const testEngine = new TestEngine(
      {
        play: [ladyTremaineBitterlyJealous, deweyLovableShowoff],
      },
      {
        hand: [diabloDevotedHerald],
      },
    );

    const cardUnderTest = testEngine.getCardModel(ladyTremaineBitterlyJealous);
    const target = testEngine.getCardModel(deweyLovableShowoff);
    const targetDiscard = testEngine.getCardModel(diabloDevotedHerald);

    target.damage = 1; // Ensure the target is damaged

    await testEngine.activateCard(cardUnderTest, {
      targets: [target],
    });

    expect(target.zone).toBe("hand");
    expect(targetDiscard.zone).toBe("discard");
  });
});
