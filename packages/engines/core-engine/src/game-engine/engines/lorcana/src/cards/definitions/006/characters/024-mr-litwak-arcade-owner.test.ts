/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mrLitwakArcadeOwner } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Mr. Litwak - Arcade Owner", () => {
  it.skip("THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: mrLitwakArcadeOwner.cost,
      play: [mrLitwakArcadeOwner],
      hand: [mrLitwakArcadeOwner],
    });

    await testEngine.playCard(mrLitwakArcadeOwner);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
