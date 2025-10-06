/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { kakamoraLongrangeSpecialist } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Kakamora - Long-Range Specialist", () => {
  it.skip("A LITTLE HELP When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.", async () => {
    const testEngine = new TestEngine({
      inkwell: kakamoraLongrangeSpecialist.cost,
      hand: [kakamoraLongrangeSpecialist],
    });

    await testEngine.playCard(kakamoraLongrangeSpecialist);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
