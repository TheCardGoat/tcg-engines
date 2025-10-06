/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { theQueenMirrorSeeker } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
