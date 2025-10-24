import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { stitchCarefreeSurfer } from "./024-stitch-carefree-surfer";

describe("Stitch - Carefree Surfer", () => {
  it.skip("**OHANA** When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.", async () => {
    const testEngine = new TestEngine({
      inkwell: stitchCarefreeSurfer.cost,
      hand: [stitchCarefreeSurfer],
    });

    await testEngine.playCard(stitchCarefreeSurfer);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
