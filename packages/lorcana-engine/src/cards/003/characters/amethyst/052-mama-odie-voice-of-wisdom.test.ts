/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mamaOdieVoiceOfWisdom } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
