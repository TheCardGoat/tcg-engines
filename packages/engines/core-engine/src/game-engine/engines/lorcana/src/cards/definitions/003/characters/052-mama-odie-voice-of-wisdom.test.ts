/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mamaOdieVoiceOfWisdom } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Mama Odie - Voice of Wisdom", () => {
  it.skip("**LISTEN TO YOUR MAMA NOW** Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.", () => {
    const testStore = new TestStore({
      inkwell: mamaOdieVoiceOfWisdom.cost,
      play: [mamaOdieVoiceOfWisdom],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mamaOdieVoiceOfWisdom.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
