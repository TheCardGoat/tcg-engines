/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  annaEagerAcolyte,
  rafikiShamanDuelist,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Anna - Eager Acolyte", () => {
  it("**GROWING POWERS** When you play this character, each opponent choses and exerts on of their ready characters.", () => {
    const testStore = new TestStore(
      {
        inkwell: annaEagerAcolyte.cost,
        hand: [annaEagerAcolyte],
      },
      {
        play: [rafikiShamanDuelist],
      },
    );

    const cardUnderTest = testStore.getCard(annaEagerAcolyte);
    const target = testStore.getCard(rafikiShamanDuelist);
    cardUnderTest.playFromHand();
    testStore.changePlayer("player_two");
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.meta.exerted).toBe(true);
  });
});
