import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { theQueenMirrorSeeker } from "./149-the-queen-mirror-seeker";

describe("The Queen - Mirror Seeker", () => {
  it.skip("**CALCULATING AND VAIN** Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: theQueenMirrorSeeker.cost,
      play: [theQueenMirrorSeeker],
      hand: [theQueenMirrorSeeker],
    });

    await testEngine.playCard(theQueenMirrorSeeker);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
