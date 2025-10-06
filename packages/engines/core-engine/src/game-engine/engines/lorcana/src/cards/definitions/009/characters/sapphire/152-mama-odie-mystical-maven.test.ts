/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mamaOdieMysticalMaven } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
