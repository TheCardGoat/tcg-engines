/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mauriceWorldFamousInventor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { mamaOdieMysticalMaven } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import { iFindEmIFlattenEm } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";

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
