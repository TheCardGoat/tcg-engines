import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { mamaOdieMysticalMaven } from "./152-mama-odie-mystical-maven";

describe("Mama Odie - Mystical Maven", () => {
  it.skip("**THIS GOING TO BE GOOD** Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: mamaOdieMysticalMaven.cost,
      play: [mamaOdieMysticalMaven],
      hand: [mamaOdieMysticalMaven],
    });

    await testEngine.playCard(mamaOdieMysticalMaven);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
