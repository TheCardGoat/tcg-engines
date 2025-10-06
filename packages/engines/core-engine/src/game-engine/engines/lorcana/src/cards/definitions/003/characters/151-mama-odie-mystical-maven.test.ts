/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mauriceWorldFamousInventor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { mamaOdieMysticalMaven } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { iFindEmIFlattenEm } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mama Odie - Mystical Maven", () => {
  it("**THIS GOING TO BE GOOD** Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: iFindEmIFlattenEm.cost,
      play: [mamaOdieMysticalMaven],
      hand: [iFindEmIFlattenEm],
      deck: [mauriceWorldFamousInventor],
    });

    const trigger = testStore.getCard(iFindEmIFlattenEm);
    const topDeckCard = testStore.getCard(mauriceWorldFamousInventor);

    trigger.playFromHand();
    testStore.resolveOptionalAbility();
    expect(topDeckCard.zone).toEqual("inkwell");
    expect(topDeckCard.ready).toEqual(false);
  });
});
