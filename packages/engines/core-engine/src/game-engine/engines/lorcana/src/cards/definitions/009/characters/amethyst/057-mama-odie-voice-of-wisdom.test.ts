import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { mamaOdieVoiceOfWisdom } from "./057-mama-odie-voice-of-wisdom";

describe("Mama Odie - Voice of Wisdom", () => {
  it.skip("**LISTEN TO YOUR MAMA NOW** Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.", async () => {
    const testEngine = new TestEngine({
      inkwell: mamaOdieVoiceOfWisdom.cost,
      play: [mamaOdieVoiceOfWisdom],
      hand: [mamaOdieVoiceOfWisdom],
    });

    await testEngine.playCard(mamaOdieVoiceOfWisdom);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
